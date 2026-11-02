#!/usr/bin/env python3
"""
Renderizador procedural do NOIR STUDIO.

Gera seis renders 3D ORIGINAIS por ray marching de funções de distância com sign (SDF),
iluminação com sombra suave, oclusão ambiente, reflexos aproximados, bloom e grão.
Nenhuma fotografia de terceiros é usada.

Uso:
  python3 scripts/render-art.py                 # todas as cenas, 1600x1200
  python3 scripts/render-art.py halo 400 300    # uma cena em resolução de teste
Saída: scripts/_raw/<cena>.png (depois convertida para WebP/AVIF por scripts/optimize-art.mjs)
"""
import os
import sys
import time

import numpy as np
from PIL import Image, ImageFilter

F = np.float32
ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, "_raw")

# Paleta em RGB linear (aproximação das cores da marca)
ACID = (0.578, 1.0, 0.010)      # #C8FF1A
BONE = (0.52, 0.51, 0.49)       # #EDEBE6 (atenuado para não estourar em tons claros)
ASH = (0.27, 0.28, 0.31)        # #8E9199
GRAPHITE = (0.011, 0.012, 0.014)
SLATE = (0.023, 0.025, 0.030)


def v3(x, y, z):
    return np.array([x, y, z], dtype=F)


def length(a):
    return np.sqrt((a * a).sum(-1))


def clamp(x, lo, hi):
    return np.minimum(np.maximum(x, lo), hi)


def norm(a):
    return a / (length(a)[..., None] + F(1e-9))


def smin(a, b, k):
    h = clamp(F(0.5) + F(0.5) * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def sd_sphere(p, c, r):
    return length(p - c) - F(r)


def sd_box(p, b, r):
    q = np.abs(p) - np.array(b, dtype=F)
    return length(np.maximum(q, 0)) + np.minimum(q.max(-1), 0) - F(r)


def sd_capsule(p, a, b, r):
    a = np.array(a, F)
    b = np.array(b, F)
    pa = p - a
    ba = b - a
    h = clamp((pa * ba).sum(-1) / F(ba @ ba), 0, 1)
    return length(pa - h[..., None] * ba) - F(r)


def sd_torus_xz(p, R, r):
    q = np.stack([length(p[..., [0, 2]]) - F(R), p[..., 1]], -1)
    return length(q) - F(r)


def sd_torus_xy(p, R, r):
    q = np.stack([length(p[..., [0, 1]]) - F(R), p[..., 2]], -1)
    return length(q) - F(r)


def sd_round_cyl_y(p, rad, half, rr):
    q = np.stack([length(p[..., [0, 2]]) - F(rad), np.abs(p[..., 1]) - half], -1)
    return np.minimum(q.max(-1), 0) + length(np.maximum(q, 0)) - F(rr)


def sd_box2(x, y, cx, cy, bx, by, r):
    qx = np.abs(x - F(cx)) - F(bx)
    qy = np.abs(y - F(cy)) - F(by)
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - F(r)


def rotx(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], dtype=F)


def rotz(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], dtype=F)


def U(d1, i1, d2, i2):
    m = d2 < d1
    return np.where(m, d2, d1), np.where(m, i2, i1)


# ----------------------------------------------------------------------------
# Cenas (cada uma retorna um dicionário com SDF, câmera, luz e materiais)
# ----------------------------------------------------------------------------

def scene_halo():
    """Halo Mobility: anéis de movimento inclinados e um núcleo luminoso."""
    def sdf(p):
        n = p.shape[0]
        d = p[:, 1] + F(1.0)
        i = np.zeros(n, np.int8)
        for k, (ax, az) in enumerate([(0.42, 0.0), (1.05, 0.55), (-0.2, 1.25)]):
            m = rotz(F(az)) @ rotx(F(ax))
            q = p @ m.T
            dt = sd_torus_xz(q, 1.0 + 0.22 * k, 0.07)
            d, i = U(d, i, dt, 2 if k < 2 else 3)
        d, i = U(d, i, sd_sphere(p, v3(0, 0, 0), 0.17), 4)
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(0.4, 1.4, -4.6), target=v3(0, 0.15, 0), fl=1.6,
        palette={0: (0.010, 0.011, 0.012), 2: (0.62, 0.61, 0.58), 3: (0.10, 0.10, 0.11), 4: ACID},
        emissive={4}, metal={2: 0.35, 3: 0.15},
        L=norm(v3(-0.5, 0.85, -0.45)), lcol=v3(2.4, 2.4, 2.45),
        shadow_k=10.0, shine=60.0, amb=0.09,
        top=(0.02, 0.022, 0.025), bot=(0.004, 0.004, 0.005), glow=(0.05, 0.11, 0.0), glow_sharp=14.0,
    )


def scene_tessera():
    """Tessera Foods: grade de potes em posições explícitas (sem repetição de domínio, sem artefatos de célula)."""
    cells = []
    for ix in range(-2, 2):
        for iz in range(-1, 2):
            cx, cz = ix * 0.95 + 0.47, iz * 0.95
            hh = 0.4 + 0.5 * abs(np.sin(ix * 12.9898 + iz * 78.233) * 43758.5453 % 1.0)
            cells.append((cx, cz, hh, (ix * 3 + iz) % 4))
    colors = {0: 2, 1: 3, 2: 4, 3: 5}

    def sdf(p):
        n = p.shape[0]
        d = p[:, 1].copy()
        i = np.zeros(n, np.int8)
        for cx, cz, hh, c in cells:
            q = p - v3(cx, hh / 2, cz)
            dj = sd_round_cyl_y(q, 0.34, hh / 2, 0.04)
            d, i = U(d, i, dj, colors[c])
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(0.0, 4.4, -4.6), target=v3(0, 0.2, 0.0), fl=1.35,
        palette={0: (0.03, 0.03, 0.033), 2: ACID, 3: (0.34, 0.33, 0.32), 4: (0.10, 0.10, 0.105), 5: (0.55, 0.54, 0.52)},
        emissive=set(), metal={2: 0.06, 3: 0.05, 4: 0.08, 5: 0.06},
        L=norm(v3(-0.55, 1.0, -0.35)), lcol=v3(2.3, 2.3, 2.35),
        shadow_k=8.0, shine=40.0, amb=0.11,
        top=(0.03, 0.03, 0.035), bot=(0.004, 0.004, 0.005), glow=(0.02, 0.03, 0.0), glow_sharp=8.0,
    )


def scene_marrow():
    """Marrow Audio: fone de estúdio abstrato — arco de banda, conchas e anel de acento."""
    def sdf(p):
        n = p.shape[0]
        q = p - v3(0, 0.1, 0)
        dt = sd_torus_xy(q, 1.05, 0.075)
        dt = np.maximum(dt, -q[:, 1])  # mantém apenas a metade superior do arco
        d = p[:, 1] + F(1.0)
        i = np.zeros(n, np.int8)
        d, i = U(d, i, dt, 1)
        for sx in (-1.0, 1.0):
            c = v3(sx * 1.05, -0.2, 0)
            dc = sd_box(p - c, (0.2, 0.3, 0.16), 0.08)
            d, i = U(d, i, dc, 2)
            dr = sd_torus_xy(p - c, 0.23, 0.012)
            d, i = U(d, i, dr, 3)
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(1.9, 1.25, -4.9), target=v3(0.0, 0.05, 0), fl=1.5,
        palette={0: SLATE, 1: BONE, 2: GRAPHITE, 3: ACID},
        emissive={3}, metal={1: 0.18, 2: 0.3},
        L=norm(v3(-0.6, 0.85, -0.45)), lcol=v3(2.4, 2.35, 2.4),
        shadow_k=7.0, shine=50.0, amb=0.08,
        top=(0.025, 0.027, 0.03), bot=(0.004, 0.004, 0.005), glow=(0.06, 0.1, 0.0), glow_sharp=10.0,
    )


def scene_oblique():
    """Oblique Arquitetura: volumes de concreto, plano de cota em acento e luz rasante."""
    def sdf(p):
        n = p.shape[0]
        d = p[:, 1].copy()
        i = np.zeros(n, np.int8)
        d, i = U(d, i, sd_box(p - v3(-0.7, 0.75, 0.2), (0.45, 0.75, 0.45), 0.004), 1)
        d, i = U(d, i, sd_box(p - v3(0.6, 0.22, 0.55), (1.0, 0.22, 0.5), 0.004), 2)
        d, i = U(d, i, sd_box(p - v3(1.25, 1.1, -0.9), (0.13, 1.1, 0.8), 0.004), 3)
        d, i = U(d, i, sd_box(p - v3(-0.1, 0.5, -1.25), (0.35, 0.5, 0.35), 0.004), 1)
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(3.6, 2.4, -4.6), target=v3(0.1, 0.45, -0.1), fl=1.45,
        palette={0: (0.05, 0.048, 0.044), 1: (0.24, 0.22, 0.20), 2: ACID, 3: (0.03, 0.03, 0.035)},
        emissive=set(), metal={},
        L=norm(v3(0.95, 0.42, -0.2)), lcol=v3(2.6, 2.6, 2.65),
        shadow_k=6.0, shine=18.0, amb=0.13,
        top=(0.035, 0.035, 0.038), bot=(0.006, 0.006, 0.007), glow=(0.02, 0.02, 0.02), glow_sharp=6.0,
    )


def scene_kairo():
    """Kairo Saúde: cápsulas suaves, luz difusa e um único acento verde."""
    def sdf(p):
        n = p.shape[0]
        d = p[:, 1] + F(0.9)
        i = np.zeros(n, np.int8)
        d1 = sd_capsule(p, (-0.5, -0.2, 0.0), (0.35, 0.5, 0.1), 0.42)
        d2 = sd_capsule(p, (0.3, -0.5, 0.5), (0.9, -0.1, 0.4), 0.28)
        ds = smin(d1, d2, 0.3)
        mat = np.where(d1 < d2, 1, 2).astype(np.int8)
        d, i = U(d, i, ds, mat)
        d, i = U(d, i, sd_sphere(p, v3(0.5, 0.75, -0.55), 0.11), 3)
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(0.7, 1.1, -4.0), target=v3(0.0, -0.1, 0), fl=1.5,
        palette={0: (0.03, 0.045, 0.038), 1: (0.46, 0.45, 0.43), 2: ACID, 3: BONE},
        emissive=set(), metal={},
        L=norm(v3(-0.3, 0.95, -0.55)), lcol=v3(1.9, 1.95, 1.9),
        shadow_k=2.5, shine=12.0, amb=0.28,
        top=(0.04, 0.05, 0.045), bot=(0.008, 0.01, 0.009), glow=(0.03, 0.06, 0.02), glow_sharp=4.0,
    )


def scene_vanta():
    """Vanta Spirits: garrafa de vidro escuro por revolução, acento verde e luz de fundo."""
    def sdf(p):
        n = p.shape[0]
        r = length(p[:, [0, 2]])
        y = p[:, 1]
        d_body = sd_box2(r, y, 0.0, -0.45, 0.38, 0.5, 0.12)
        d_neck = sd_box2(r, y, 0.0, 0.45, 0.12, 0.42, 0.04)
        d_cap = sd_box2(r, y, 0.0, 0.93, 0.14, 0.06, 0.02)
        d_glass, i_glass = U(d_body, np.ones(n, np.int8), d_neck, np.ones(n, np.int8))
        label = (y > -0.75) & (y < -0.35)
        i_glass = np.where(label & (d_body <= d_neck), 3, i_glass).astype(np.int8)
        d, i = U(d_glass, i_glass, d_cap, np.full(n, 2, np.int8))
        d, i = U(d, i, p[:, 1] + F(1.0), np.zeros(n, np.int8))
        d, i = U(d, i, sd_sphere(p, v3(0.95, 0.55, 1.7), 0.2), np.full(n, 4, np.int8))
        return d, i

    return dict(
        sdf=sdf,
        ro=v3(0.0, 0.85, -4.3), target=v3(0.0, 0.05, 0.0), fl=1.7,
        palette={0: (0.012, 0.012, 0.014), 1: (0.02, 0.028, 0.022), 2: ACID, 3: BONE, 4: ACID},
        emissive={4}, metal={1: 0.7, 3: 0.2},
        L=norm(v3(-0.5, 0.75, -0.5)), lcol=v3(2.0, 2.0, 2.05),
        shadow_k=9.0, shine=120.0, amb=0.06,
        top=(0.05, 0.05, 0.055), bot=(0.004, 0.004, 0.005), glow=(0.08, 0.14, 0.0), glow_sharp=10.0,
    )


SCENES = {
    "halo-mobility": scene_halo,
    "tessera-foods": scene_tessera,
    "marrow-audio": scene_marrow,
    "oblique-architecture": scene_oblique,
    "kairo-health": scene_kairo,
    "vanta-spirits": scene_vanta,
}


# ----------------------------------------------------------------------------
# Renderização
# ----------------------------------------------------------------------------

def march(sdf, ro, rd, steps=120, tmax=14.0):
    n = rd.shape[0]
    t = np.zeros(n, F)
    done = np.zeros(n, bool)
    hit = np.zeros(n, bool)
    for _ in range(steps):
        act = np.nonzero(~done)[0]
        if act.size == 0:
            break
        p = ro + rd[act] * t[act, None]
        d, _ = sdf(p)
        close = d < F(0.0009) * t[act]
        far = t[act] > F(tmax)
        hit[act[close]] = True
        done[act[close | far]] = True
        cont = ~(close | far)
        t[act[cont]] += d[cont] * F(0.92)
    return t, hit


def get_normal(sdf, p):
    e = F(0.0012)
    n = np.zeros_like(p)
    for kx, ky, kz in [(1, -1, -1), (-1, -1, 1), (-1, 1, -1), (1, 1, 1)]:
        k = np.array([kx, ky, kz], F)
        d, _ = sdf(p + k * e)
        n += k[None, :] * d[:, None]
    return norm(n)


def soft_shadow(sdf, p, L, k, steps=56):
    n = p.shape[0]
    res = np.ones(n, F)
    t = np.full(n, F(0.02), F)
    for _ in range(steps):
        d, _ = sdf(p + L * t[:, None])
        res = np.minimum(res, F(k) * d / t)
        t += clamp(d, F(0.02), F(0.25))
        if (t > 7).all():
            break
    return clamp(res, 0, 1)


def ambient_occlusion(sdf, p, n):
    occ = np.zeros(p.shape[0], F)
    sca = F(1.0)
    for i in range(1, 6):
        h = F(0.035 * i)
        d, _ = sdf(p + n * h)
        occ += (h - d) * sca
        sca *= F(0.85)
    return clamp(1 - 2.5 * occ, 0, 1)


def env_color(sc, r):
    t = clamp(r[:, 1] * F(0.5) + F(0.5), 0, 1)[:, None]
    bot = np.array(sc["bot"], F)
    top = np.array(sc["top"], F)
    col = bot * (1 - t) + top * t
    L = np.array(sc["L"], F)
    spot = clamp((r * L).sum(-1), 0, 1)
    soft = clamp((spot - F(0.9)) / F(0.09), 0, 1) ** 2
    return col + np.array(sc["lcol"], F) * soft[:, None] * F(0.35)


def shade(sc, sdf, p, rd, n, ids):
    L = np.array(sc["L"], F)
    lcol = np.array(sc["lcol"], F)
    sh = soft_shadow(sdf, p + n * F(0.012), L, sc["shadow_k"])
    ao = ambient_occlusion(sdf, p, n)
    alb = np.zeros((p.shape[0], 3), F)
    refl = np.zeros(p.shape[0], F)
    emis = np.zeros(p.shape[0], bool)
    for mid, col in sc["palette"].items():
        sel = ids == mid
        alb[sel] = col
        refl[sel] = sc["metal"].get(mid, 0.04)
        if mid in sc["emissive"]:
            emis[sel] = True
    ndl = clamp((n * L).sum(-1), 0, 1)
    hv = norm(L[None, :] - rd)
    spec = clamp((n * hv).sum(-1), 0, 1) ** F(sc["shine"])
    fres = (1 - clamp((n * -rd).sum(-1), 0, 1)) ** 5
    r = rd - 2 * (n * rd).sum(-1)[:, None] * n
    env = env_color(sc, r)
    col = alb * (ndl * sh)[:, None] * lcol
    col += alb * ao[:, None] * np.array(sc["amb"], F)
    col += (spec * sh)[:, None] * lcol * F(0.35)
    col += (fres * refl)[:, None] * env + (refl * 0.5)[:, None] * env
    col = np.where(emis[:, None], alb * F(3.2), col)
    return col


def background(sc, rd):
    L = np.array(sc["L"], F)
    glow = np.array(sc["glow"], F)
    base = env_color(sc, rd)
    g = np.exp(-(1 - clamp((rd * L).sum(-1), -1, 1)) * F(sc["glow_sharp"]))
    return base + g[:, None] * glow


def render(name, W, H, out_path):
    sc = SCENES[name]()
    sdf = sc["sdf"]
    t0 = time.time()
    ro = sc["ro"]
    fwd = norm(sc["target"] - ro)
    right = norm(np.cross(fwd, v3(0, 1, 0)))
    up = np.cross(right, fwd)
    ys, xs = np.mgrid[0:H, 0:W].astype(F)
    u = (xs - F(W / 2)) / F(H)
    v = -(ys - F(H / 2)) / F(H)
    rd = (fwd[None, None, :] * F(sc["fl"]) + right[None, None, :] * u[..., None] + up[None, None, :] * v[..., None])
    rd = norm(rd.reshape(-1, 3).astype(F))

    t, hit = march(sdf, ro, rd)
    p = ro + rd * t[:, None]
    _, ids = sdf(p)
    col = background(sc, rd)
    if hit.any():
        hp = p[hit]
        hr = rd[hit]
        n = get_normal(sdf, hp)
        col[hit] = shade(sc, sdf, hp, hr, n, ids[hit])
    print(f"  march+shade {name} {W}x{H}: {time.time() - t0:.1f}s, hits={hit.mean():.2f}", flush=True)

    # Tone mapping ACES aproximado + gamma
    x = np.maximum(col, 0) * F(0.78)
    x = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14)
    img = np.clip(x, 0, 1) ** F(1 / 2.2)
    img = img.reshape(H, W, 3)

    # Bloom leve: realça áreas luminosas (acento verde e reflexos)
    bright = np.clip(img - 0.72, 0, 1)
    bl = Image.fromarray((bright * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=max(W, H) / 60))
    img = np.clip(img + np.asarray(bl, F) / 255 * F(0.55), 0, 1)

    # Vinheta e grão de filme
    vy, vx = np.mgrid[0:H, 0:W].astype(F)
    rr = ((vx - W / 2) / W) ** 2 + ((vy - H / 2) / H) ** 2
    img *= (1 - F(0.7) * rr)[..., None]
    rng = np.random.default_rng(7)
    img += rng.normal(0, 0.012, img.shape).astype(F)
    img = np.clip(img, 0, 1)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    Image.fromarray((img * 255 + 0.5).astype(np.uint8), "RGB").save(out_path)
    print(f"  saved {out_path}", flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    W, H = 1600, 1200
    only = None
    if args and args[0] in SCENES or (args and any(args[0] in k for k in SCENES)):
        key = next(k for k in SCENES if args[0] == k or args[0] in k)
        only = [key]
        if len(args) >= 3:
            W, H = int(args[1]), int(args[2])
    names = only or list(SCENES)
    for name in names:
        render(name, W, H, os.path.join(RAW, f"{name}.png"))
