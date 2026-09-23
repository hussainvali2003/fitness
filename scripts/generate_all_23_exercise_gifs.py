import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "public/exercises"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 560, 420
N_FRAMES = 28
FRAME_DURATION = 115  # ~3.22 seconds per rep cycle (slow, educational, easy to understand)

# GYM X Dribbble Color System
ORANGE = (238, 77, 0)
ORANGE_BRIGHT = (255, 120, 25)
ORANGE_CORE = (255, 235, 215)
DARK_BG = (8, 8, 10)
CARD_BG = (17, 17, 20)
BORDER_COLOR = (38, 38, 43)
BODY_BASE = (38, 42, 52)
BODY_SHADOW = (22, 25, 32)
BODY_HIGHLIGHT = (70, 78, 95)
STEEL_GRAY = (140, 145, 155)
CHROME = (215, 220, 230)
BENCH_LEATHER = (24, 24, 28)
BENCH_STEEL = (45, 48, 55)

# Seeded floating embers for cinematic 3D studio look
np.random.seed(42)
EMBERS = []
for _ in range(32):
    EMBERS.append({
        'x': np.random.uniform(0.04, 0.96) * WIDTH,
        'y': np.random.uniform(0.08, 0.94) * HEIGHT,
        'speed': np.random.uniform(2.0, 5.0),
        'size': np.random.uniform(1.5, 3.2),
        'alpha': np.random.uniform(0.35, 0.85),
        'drift': np.random.uniform(-1.0, 1.0)
    })

def create_studio_background(draw, exercise_title, target_muscle, form_cue, phase_text, progress_pct, f, angle_cue=""):
    cx, cy = WIDTH // 2, HEIGHT // 2 + 25
    # Radial studio floor spotlight
    for r in range(220, 30, -18):
        alpha = int(14 * (1.0 - r / 220.0))
        draw.ellipse([cx - r * 1.35, cy - r * 0.65, cx + r * 1.35, cy + r * 0.65], fill=(238, 77, 0, alpha))
    
    # Perspective grid lines on floor
    floor_y = 285
    for gx in range(40, WIDTH, 50):
        top_gx = cx + int((gx - cx) * 0.42)
        draw.line([(top_gx, floor_y - 25), (gx, HEIGHT - 40)], fill=(32, 34, 42, 75), width=1)
    for gy in [floor_y - 12, floor_y + 22, floor_y + 60, floor_y + 95]:
        draw.line([(35, gy), (WIDTH - 35, gy)], fill=(34, 36, 45, 65), width=1)

    # Floating fiery orange embers
    t = f / N_FRAMES
    for emb in EMBERS:
        ey = (emb['y'] - f * emb['speed'] * 3.5) % (HEIGHT - 75) + 40
        ex = emb['x'] + math.sin(t * 2 * math.pi + emb['drift']) * 6
        rad = emb['size']
        ea = int(255 * emb['alpha'] * (0.6 + 0.4 * math.sin(t * 2 * math.pi + emb['speed'])))
        draw.ellipse([ex - rad*2, ey - rad*2, ex + rad*2, ey + rad*2], fill=(238, 77, 0, ea // 4))
        draw.ellipse([ex - rad, ey - rad, ex + rad, ey + rad], fill=(255, 140, 30, ea))

    # Top HUD Bar
    draw.rectangle([0, 0, WIDTH, 44], fill=(12, 12, 16, 235))
    draw.line([(0, 44), (WIDTH, 44)], fill=(238, 77, 0, 190), width=2)
    
    # Top Left Badge & Title
    draw.rectangle([14, 11, 108, 33], fill=(238, 77, 0, 45), outline=(238, 77, 0, 180), width=1)
    draw.text((22, 15), "GYM X 3D HD", fill=(238, 77, 0))
    draw.text((118, 14), exercise_title.upper(), fill=(255, 255, 255))
    
    # Top Right Active Tension Indicator
    draw.rectangle([WIDTH - 155, 11, WIDTH - 14, 33], fill=(20, 22, 28, 220), outline=(50, 55, 68), width=1)
    bar_w = int(136 * progress_pct)
    draw.rectangle([WIDTH - 152, 14, WIDTH - 152 + bar_w, 30], fill=(238, 77, 0))
    draw.text((WIDTH - 144, 16), "ACTIVE TENSION", fill=(255, 255, 255))

    # Angle guide badge if present
    if angle_cue:
        draw.rectangle([WIDTH - 255, 11, WIDTH - 165, 33], fill=(18, 18, 22, 200), outline=(238, 77, 0, 140), width=1)
        draw.text((WIDTH - 248, 16), angle_cue, fill=(255, 170, 80))

    # Bottom HUD Bar (2 tiers for comprehensive form cue)
    draw.rectangle([0, HEIGHT - 42, WIDTH, HEIGHT], fill=(12, 12, 16, 240))
    draw.line([(0, HEIGHT - 42), (WIDTH, HEIGHT - 42)], fill=(38, 38, 43), width=1)
    draw.text((18, HEIGHT - 33), f"TARGET: {target_muscle.upper()}", fill=(180, 185, 195))
    draw.text((180, HEIGHT - 33), f"CUE: {form_cue}", fill=(240, 240, 245))
    draw.text((WIDTH - 150, HEIGHT - 33), f"PHASE: {phase_text.upper()}", fill=(238, 77, 0))

def draw_glowing_polygon(draw, points, glow_intensity=1.0, is_active=True):
    """Draws anatomical muscle region with smooth shading and active multi-layer neon glow"""
    if is_active and glow_intensity > 0.12:
        for pad in [7, 4, 2]:
            g_alpha = int(45 * glow_intensity * (1.0 - pad / 9.0))
            if len(points) >= 3:
                cx = sum(p[0] for p in points) / len(points)
                cy = sum(p[1] for p in points) / len(points)
                halo = [(cx + (p[0] - cx) * (1.0 + pad * 0.08), cy + (p[1] - cy) * (1.0 + pad * 0.08)) for p in points]
                draw.polygon(halo, fill=(238, 77, 0, g_alpha))
        
        fill_r = int(BODY_BASE[0] + (ORANGE[0] - BODY_BASE[0]) * glow_intensity)
        fill_g = int(BODY_BASE[1] + (ORANGE[1] - BODY_BASE[1]) * glow_intensity)
        fill_b = int(BODY_BASE[2] + (ORANGE[2] - BODY_BASE[2]) * glow_intensity)
        draw.polygon(points, fill=(fill_r, fill_g, fill_b, 255), outline=(255, 145, 55, int(220 * glow_intensity)), width=2)
    else:
        draw.polygon(points, fill=BODY_BASE, outline=BODY_HIGHLIGHT, width=1)

def draw_head_and_neck(draw, cx, cy):
    draw.ellipse([cx - 17, cy - 58, cx + 17, cy - 20], fill=BODY_BASE, outline=BODY_HIGHLIGHT, width=1)
    draw.polygon([(cx - 12, cy - 35), (cx + 12, cy - 35), (cx + 5, cy - 18), (cx - 5, cy - 18)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    draw.polygon([(cx - 9, cy - 20), (cx + 9, cy - 20), (cx + 13, cy - 5), (cx - 13, cy - 5)], fill=BODY_SHADOW, outline=BODY_HIGHLIGHT)
    draw.polygon([(cx - 34, cy - 5), (cx - 13, cy - 5), (cx - 9, cy - 20)], fill=BODY_SHADOW)
    draw.polygon([(cx + 34, cy - 5), (cx + 13, cy - 5), (cx + 9, cy - 20)], fill=BODY_SHADOW)

def draw_sculpted_torso(draw, cx, cy, chest_glow=0.0, lats_glow=0.0, abs_glow=0.0):
    # Lats flares (Left & Right)
    if lats_glow > 0.1:
        lat_l = [(cx - 44, cy + 15), (cx - 68, cy + 42), (cx - 42, cy + 85), (cx - 28, cy + 70)]
        draw_glowing_polygon(draw, lat_l, glow_intensity=lats_glow, is_active=True)
        lat_r = [(cx + 44, cy + 15), (cx + 68, cy + 42), (cx + 42, cy + 85), (cx + 28, cy + 70)]
        draw_glowing_polygon(draw, lat_r, glow_intensity=lats_glow, is_active=True)
    else:
        draw.polygon([(cx - 44, cy + 15), (cx - 64, cy + 42), (cx - 40, cy + 85), (cx - 28, cy + 70)], fill=BODY_SHADOW)
        draw.polygon([(cx + 44, cy + 15), (cx + 64, cy + 42), (cx + 40, cy + 85), (cx + 28, cy + 70)], fill=BODY_SHADOW)

    # Clavicles
    draw.line([(cx - 45, cy), (cx, cy + 6)], fill=BODY_HIGHLIGHT, width=2)
    draw.line([(cx + 45, cy), (cx, cy + 6)], fill=BODY_HIGHLIGHT, width=2)
    
    # Pectoralis Major - Left & Right
    pec_l = [(cx - 4, cy + 8), (cx - 44, cy + 2), (cx - 48, cy + 26), (cx - 32, cy + 42), (cx - 4, cy + 40)]
    draw_glowing_polygon(draw, pec_l, glow_intensity=chest_glow, is_active=chest_glow > 0.05)
    pec_r = [(cx + 4, cy + 8), (cx + 44, cy + 2), (cx + 48, cy + 26), (cx + 32, cy + 42), (cx + 4, cy + 40)]
    draw_glowing_polygon(draw, pec_r, glow_intensity=chest_glow, is_active=chest_glow > 0.05)
    
    draw.line([(cx, cy + 6), (cx, cy + 42)], fill=(20, 20, 25), width=2)
    
    # 6-Pack Rectus Abdominis
    for i in range(3):
        ay = cy + 48 + i * 15
        abs_l = [(cx - 20, ay), (cx - 3, ay), (cx - 3, ay + 12), (cx - 20, ay + 12)]
        abs_r = [(cx + 3, ay), (cx + 20, ay), (cx + 20, ay + 12), (cx + 3, ay + 12)]
        draw_glowing_polygon(draw, abs_l, glow_intensity=abs_glow, is_active=abs_glow > 0.05)
        draw_glowing_polygon(draw, abs_r, glow_intensity=abs_glow, is_active=abs_glow > 0.05)

    # Waist & hips
    draw.polygon([(cx - 34, cy + 96), (cx + 34, cy + 96), (cx + 26, cy + 122), (cx - 26, cy + 122)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)

# =========================================================================
# 1. PUSH EXERCISES
# =========================================================================

def render_bench_press(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Eccentric (3s Lower)"
        bar_y_offset = int(norm * 42)
        tension = 0.35 + 0.65 * norm
        angle_str = f"Angle: {int(90 - norm * 45)}°"
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Concentric (Drive Up)"
        bar_y_offset = int((1.0 - norm) * 42)
        tension = 1.0 - 0.4 * norm
        angle_str = f"Angle: {int(45 + norm * 45)}°"

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Barbell Bench Press", "Mid & Lower Chest", "Tuck elbows 45° · Drive feet into floor", phase_str, tension, f, angle_str)
    
    # Flat Bench
    draw.rectangle([cx - 52, cy - 78, cx + 52, cy + 128], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw.rectangle([cx - 62, cy + 118, cx + 62, cy + 132], fill=BENCH_STEEL)

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension)

    # Barbell & Hands
    bar_y = cy - 8 + bar_y_offset
    draw.line([(cx - 160, bar_y), (cx + 160, bar_y)], fill=CHROME, width=7)
    for px in [-150, -140, 140, 150]:
        draw.ellipse([px - 14, bar_y - 32, px + 14, bar_y + 32], fill=STEEL_GRAY, outline=ORANGE, width=2)

    # Arm joints
    draw.line([(cx - 48, cy + 15), (cx - 85, cy + 30 + bar_y_offset // 2)], fill=BODY_BASE, width=12)
    draw.line([(cx - 85, cy + 30 + bar_y_offset // 2), (cx - 70, bar_y)], fill=BODY_BASE, width=10)
    draw.line([(cx + 48, cy + 15), (cx + 85, cy + 30 + bar_y_offset // 2)], fill=BODY_BASE, width=12)
    draw.line([(cx + 85, cy + 30 + bar_y_offset // 2), (cx + 70, bar_y)], fill=BODY_BASE, width=10)
    return im.convert("RGB")

def render_incline_db_press(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Eccentric (Deep Stretch)"
        travel = norm
        tension = 0.4 + 0.6 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Concentric (Press Up)"
        travel = 1.0 - norm
        tension = 1.0 - 0.35 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Incline Dumbbell Press", "Upper Clavicular Chest", "Bench 30° · Squeeze pecs at peak", phase, tension, f, "30° Incline")
    
    # Incline Bench
    draw.polygon([(cx - 48, cy - 85), (cx + 48, cy - 85), (cx + 38, cy + 120), (cx - 38, cy + 120)], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension)

    db_spread = int(48 + travel * 32)
    db_y = cy - 25 + int(travel * 48)

    # Dumbbells
    for side in [-1, 1]:
        hx = cx + side * db_spread
        draw.line([(hx - 18, db_y), (hx + 18, db_y)], fill=CHROME, width=6)
        draw.rectangle([hx - 22, db_y - 12, hx - 14, db_y + 12], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx + 14, db_y - 12, hx + 22, db_y + 12], fill=BODY_SHADOW, outline=ORANGE, width=1)
        # Arm
        draw.line([(cx + side * 44, cy + 15), (cx + side * (db_spread + 18), cy + 40 + int(travel * 20))], fill=BODY_BASE, width=12)
        draw.line([(cx + side * (db_spread + 18), cy + 40 + int(travel * 20)), (hx, db_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_machine_chest_press(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Press Out)"
        travel = norm
        tension = 0.4 + 0.6 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Return Control)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Machine Chest Press", "Pectoralis Major", "Shoulders back against pad · Lockout soft", phase, tension, f, "Guided Track")
    
    # Machine Backrest & Frame
    draw.rectangle([cx - 40, cy - 70, cx + 40, cy + 120], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension)

    handle_x_offset = int(travel * 36)
    handle_y = cy + 20

    # Machine Lever Arms
    for side in [-1, 1]:
        hx = cx + side * (60 + handle_x_offset)
        draw.line([(cx + side * 120, cy - 40), (hx, handle_y)], fill=BENCH_STEEL, width=6)
        draw.rectangle([hx - 6, handle_y - 14, hx + 6, handle_y + 14], fill=ORANGE)
        # Arms
        draw.line([(cx + side * 44, cy + 15), (cx + side * (55 + handle_x_offset // 2), cy + 45)], fill=BODY_BASE, width=12)
        draw.line([(cx + side * (55 + handle_x_offset // 2), cy + 45), (hx, handle_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_cable_fly(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Hug Inward)"
        travel = norm
        tension = 0.3 + 0.7 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Chest Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.45 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Cable Chest Fly", "Sternal Chest & Outer Stretch", "Hug a large tree · Keep elbows slightly bent", phase, tension, f, "Arc Motion")
    
    # Cable Towers (Left & Right)
    draw.rectangle([20, 60, 40, HEIGHT - 50], fill=BENCH_STEEL)
    draw.rectangle([WIDTH - 40, 60, WIDTH - 20, HEIGHT - 50], fill=BENCH_STEEL)
    draw.ellipse([25, 120, 45, 140], fill=ORANGE)
    draw.ellipse([WIDTH - 45, 120, WIDTH - 25, 140], fill=ORANGE)

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension)

    # Arm sweep arc
    sweep = int((1.0 - travel) * 90)
    for side in [-1, 1]:
        hx = cx + side * (32 + sweep)
        hy = cy + 24 + int(travel * 10)
        # Cable from pulley
        px = 35 if side == -1 else WIDTH - 35
        draw.line([(px, 130), (hx, hy)], fill=(160, 165, 175), width=2)
        # Handle & Hand
        draw.ellipse([hx - 8, hy - 8, hx + 8, hy + 8], fill=ORANGE)
        draw.line([(cx + side * 44, cy + 15), (cx + side * (40 + sweep // 2), cy + 42)], fill=BODY_BASE, width=12)
        draw.line([(cx + side * (40 + sweep // 2), cy + 42), (hx, hy)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_lateral_raise(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Raise to 90°)"
        travel = norm
        tension = 0.3 + 0.7 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Slow Lowering)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Dumbbell Lateral Raise", "Lateral Deltoid", "Lead with elbows · Stop at parallel 90°", phase, tension, f, "90° Parallel")
    
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    # Shoulders glowing orange
    for side in [-1, 1]:
        delt = [(cx + side * 45, cy), (cx + side * 70, cy + 5), (cx + side * 72, cy + 28), (cx + side * 46, cy + 26)]
        draw_glowing_polygon(draw, delt, glow_intensity=tension, is_active=True)

    # Arms raising outward
    arm_angle = travel * (math.pi / 2 - 0.15)
    for side in [-1, 1]:
        ex = cx + side * (45 + math.sin(arm_angle) * 55)
        ey = cy + 15 + math.cos(arm_angle) * 55
        hx = cx + side * (45 + math.sin(arm_angle) * 110)
        hy = cy + 15 + math.cos(arm_angle) * 110
        draw.line([(cx + side * 45, cy + 15), (ex, ey)], fill=BODY_BASE, width=12)
        draw.line([(ex, ey), (hx, hy)], fill=BODY_BASE, width=10)
        # Dumbbell
        draw.rectangle([hx - 10, hy - 6, hx + 10, hy + 6], fill=CHROME)
        draw.rectangle([hx - 14, hy - 10, hx - 8, hy + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx + 8, hy - 10, hx + 14, hy + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)

    return im.convert("RGB")

def render_shoulder_press(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Press Overhead)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Lower to Ears)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 225
    create_studio_background(draw, "Seated DB Shoulder Press", "Anterior & Lateral Delts", "Upright bench 75° · Full overhead extension", phase, tension, f, "75° Seat")
    
    # Bench upright pad
    draw.rectangle([cx - 36, cy - 40, cx + 36, cy + 110], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    # Delts glowing
    for side in [-1, 1]:
        delt = [(cx + side * 45, cy), (cx + side * 68, cy + 5), (cx + side * 70, cy + 28), (cx + side * 46, cy + 26)]
        draw_glowing_polygon(draw, delt, glow_intensity=tension, is_active=True)

    hand_y = cy - 20 - int(travel * 65)
    hand_spread = int(58 - travel * 18)

    for side in [-1, 1]:
        hx = cx + side * hand_spread
        draw.line([(hx - 16, hand_y), (hx + 16, hand_y)], fill=CHROME, width=6)
        draw.rectangle([hx - 20, hand_y - 10, hx - 12, hand_y + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx + 12, hand_y - 10, hx + 20, hand_y + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        # Arm
        draw.line([(cx + side * 44, cy + 15), (cx + side * 68, cy + 15 - int(travel * 25))], fill=BODY_BASE, width=12)
        draw.line([(cx + side * 68, cy + 15 - int(travel * 25)), (hx, hand_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_triceps_pushdown(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Lockout Down)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled 90°)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Cable Triceps Pushdown", "Triceps Lateral & Medial Heads", "Pin elbows to ribs · Lockout with triceps", phase, tension, f, "Elbow Hinge")
    
    # Overhead cable pulley
    draw.ellipse([cx - 18, 55, cx + 18, 90], fill=CHROME, outline=ORANGE, width=2)
    draw_head_and_neck(draw, cx, cy - 40)
    draw_sculpted_torso(draw, cx, cy - 5)

    elbow_y = cy + 25
    hand_y = cy + 25 + int(travel * 58)

    draw.line([(cx, 75), (cx, hand_y - 6)], fill=(180, 185, 195), width=2)

    # Triceps glowing
    for side in [-1, 1]:
        tricep = [(cx + side * 46, cy), (cx + side * 62, cy + 6), (cx + side * 56, elbow_y), (cx + side * 42, elbow_y - 6)]
        draw_glowing_polygon(draw, tricep, glow_intensity=tension, is_active=True)
        draw.line([(cx + side * 44, elbow_y), (cx + side * 22, hand_y)], fill=BODY_BASE, width=10)

    # Straight bar
    draw.line([(cx - 34, hand_y), (cx + 34, hand_y)], fill=CHROME, width=6)
    draw.rectangle([cx - 38, hand_y - 4, cx - 34, hand_y + 4], fill=ORANGE)
    draw.rectangle([cx + 34, hand_y - 4, cx + 38, hand_y + 4], fill=ORANGE)

    return im.convert("RGB")

def render_overhead_triceps_ext(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Extend Forward)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Long-Head Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 220
    create_studio_background(draw, "Overhead Cable Triceps Ext", "Triceps Long Head", "Keep upper arms still · Deep stretch behind head", phase, tension, f, "Long Head Focus")
    
    draw_head_and_neck(draw, cx, cy - 25)
    draw_sculpted_torso(draw, cx, cy + 15)

    elbow_y = cy - 35
    hand_y = cy - 45 - int(travel * 50)
    hand_spread = int(14 + travel * 26)

    for side in [-1, 1]:
        tricep = [(cx + side * 40, cy + 5), (cx + side * 52, cy - 15), (cx + side * 45, elbow_y), (cx + side * 32, elbow_y)]
        draw_glowing_polygon(draw, tricep, glow_intensity=tension, is_active=True)
        draw.line([(cx + side * 36, elbow_y), (cx + side * hand_spread, hand_y)], fill=BODY_BASE, width=10)
        draw.ellipse([cx + side * hand_spread - 7, hand_y - 7, cx + side * hand_spread + 7, hand_y + 7], fill=ORANGE)

    return im.convert("RGB")

# =========================================================================
# 2. PULL & BACK EXERCISES
# =========================================================================

def render_lat_pulldown(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Pull to Upper Chest)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Full Lat Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Wide Grip Lat Pulldown", "Latissimus Dorsi", "Drive elbows to hip pockets · Lean back 15°", phase, tension, f, "V-Taper Stretch")

    # High Pulley & Angled Wide Bar
    draw.rectangle([cx - 20, 50, cx + 20, 72], fill=BENCH_STEEL)
    draw.ellipse([cx - 15, 62, cx + 15, 92], fill=CHROME, outline=ORANGE, width=2)

    bar_y = 90 + int(travel * 68)
    draw.line([(cx, 77), (cx, bar_y)], fill=(180, 185, 195), width=2)
    # Wide angled lat bar
    draw.line([(cx - 145, bar_y + 12), (cx - 70, bar_y), (cx + 70, bar_y), (cx + 145, bar_y + 12)], fill=CHROME, width=6)
    draw.rectangle([cx - 150, bar_y + 8, cx - 142, bar_y + 16], fill=ORANGE)
    draw.rectangle([cx + 142, bar_y + 8, cx + 150, bar_y + 16], fill=ORANGE)

    # Seated Athlete with slight 15° lean
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, lats_glow=tension)

    # Arms pulling down
    for side in [-1, 1]:
        hx = cx + side * 120
        hy = bar_y + 6
        ex = cx + side * (75 - int(travel * 15))
        ey = cy + 15 + int(travel * 35)
        draw.line([(cx + side * 44, cy + 15), (ex, ey)], fill=BODY_BASE, width=12)
        draw.line([(ex, ey), (hx, hy)], fill=BODY_BASE, width=10)
        draw.ellipse([hx - 6, hy - 6, hx + 6, hy + 6], fill=(50, 55, 68))

    return im.convert("RGB")

def render_chest_supported_row(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Scapular Retraction)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Full Mid-Back Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Chest Supported Row", "Rhomboids & Mid Traps", "Keep chest pinned to pad · Squeeze shoulder blades", phase, tension, f, "Zero Shear")

    # Incline Chest Support Pad
    draw.polygon([(cx - 35, cy - 60), (cx + 35, cy - 60), (cx + 25, cy + 110), (cx - 25, cy + 110)], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx, cy - 30)
    draw_sculpted_torso(draw, cx, cy, lats_glow=tension * 0.8)

    # Dumbbells rowing up / back
    hand_y = cy + 55 - int(travel * 48)
    for side in [-1, 1]:
        hx = cx + side * (48 + int(travel * 12))
        draw.line([(hx - 14, hand_y), (hx + 14, hand_y)], fill=CHROME, width=6)
        draw.rectangle([hx - 18, hand_y - 10, hx - 10, hand_y + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx + 10, hand_y - 10, hx + 18, hand_y + 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        # Arm pulling elbow high
        ex = cx + side * (55 + int(travel * 25))
        ey = cy + 25 - int(travel * 20)
        draw.line([(cx + side * 44, cy + 15), (ex, ey)], fill=BODY_BASE, width=12)
        draw.line([(ex, ey), (hx, hand_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_seated_cable_row(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Pull to Navel)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Full Arm Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Seated Cable Row", "Lats & Lower Trapezius", "Drive elbows back · Upright posture (no swinging)", phase, tension, f, "Neutral Spine")

    # Low Cable Pulley Station
    draw.rectangle([cx - 24, cy + 40, cx + 24, cy + 70], fill=BENCH_STEEL)
    draw.ellipse([cx - 12, cy + 45, cx + 12, cy + 65], fill=ORANGE)

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, lats_glow=tension)

    # V-Handle moving from extended to abdomen
    handle_y = cy + 30 + int(travel * 18)
    handle_spread = int(18 - travel * 6)
    draw.line([(cx, cy + 55), (cx, handle_y)], fill=(180, 185, 195), width=2)

    # V-Bar handle
    draw.polygon([(cx - 16, handle_y), (cx + 16, handle_y), (cx, handle_y - 12)], outline=CHROME, width=2)

    for side in [-1, 1]:
        ex = cx + side * (50 + int(travel * 18))
        ey = cy + 30 + int(travel * 15)
        draw.line([(cx + side * 44, cy + 15), (ex, ey)], fill=BODY_BASE, width=12)
        draw.line([(ex, ey), (cx + side * 12, handle_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_straight_arm_pulldown(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Arc Down to Thighs)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Ascend to Eye Level)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Straight Arm Lat Pulldown", "Latissimus Dorsi Isolation", "Keep arms straight · Depress shoulder blades", phase, tension, f, "Arm Lever Arc")

    # High pulley
    draw.ellipse([cx - 16, 52, cx + 16, 84], fill=CHROME, outline=ORANGE, width=2)
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy, lats_glow=tension)

    # Bar sweeps in arc from eye level down to thighs
    bar_y = cy - 25 + int(travel * 75)
    draw.line([(cx, 68), (cx, bar_y)], fill=(180, 185, 195), width=2)
    draw.line([(cx - 48, bar_y), (cx + 48, bar_y)], fill=CHROME, width=5)

    for side in [-1, 1]:
        hx = cx + side * 36
        draw.line([(cx + side * 44, cy + 15), (hx, bar_y)], fill=BODY_BASE, width=11)
        draw.line([(cx + side * 44, cy + 15), (hx, bar_y)], fill=BODY_HIGHLIGHT, width=2)

    return im.convert("RGB")

def render_reverse_pec_deck(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Horizontal Abduction)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled Return)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Reverse Pec Deck", "Posterior Rear Deltoids", "Lead with elbows outward · Traps relaxed", phase, tension, f, "Rear Delt Arc")

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    # Rear delts glowing
    for side in [-1, 1]:
        rear_delt = [(cx + side * 38, cy + 5), (cx + side * 62, cy + 10), (cx + side * 60, cy + 32), (cx + side * 36, cy + 28)]
        draw_glowing_polygon(draw, rear_delt, glow_intensity=tension, is_active=True)

    # Arms sweeping back horizontally
    spread = int(35 + travel * 65)
    for side in [-1, 1]:
        hx = cx + side * spread
        hy = cy + 20
        draw.line([(cx + side * 44, cy + 15), (hx, hy)], fill=BODY_BASE, width=11)
        draw.rectangle([hx - 6, hy - 14, hx + 6, hy + 14], fill=ORANGE)

    return im.convert("RGB")

def render_db_curl(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Curl & Supinate)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (3s Slow Lower)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Standing Dumbbell Biceps Curl", "Biceps Brachii (Short & Long Heads)", "Pin elbows at sides · Turn pinky up at peak", phase, tension, f, "Supination Peak")

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    elbow_y = cy + 30
    hand_y = cy + 65 - int(travel * 55)

    # Biceps glowing
    for side in [-1, 1]:
        bicep = [(cx + side * 45, cy + 5), (cx + side * 62, cy + 12), (cx + side * 58, elbow_y - 2), (cx + side * 42, elbow_y - 2)]
        draw_glowing_polygon(draw, bicep, glow_intensity=tension, is_active=True)

        hx = cx + side * 48
        draw.line([(cx + side * 44, cy + 15), (cx + side * 48, elbow_y)], fill=BODY_BASE, width=12)
        draw.line([(cx + side * 48, elbow_y), (hx, hand_y)], fill=BODY_BASE, width=10)
        # Dumbbell
        draw.line([(hx - 14, hand_y), (hx + 14, hand_y)], fill=CHROME, width=6)
        draw.rectangle([hx - 18, hand_y - 8, hx - 10, hand_y + 8], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx + 10, hand_y - 8, hx + 18, hand_y + 8], fill=BODY_SHADOW, outline=ORANGE, width=1)

    return im.convert("RGB")

def render_hammer_curl(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Hammer Lift)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled Descent)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Neutral Grip Hammer Curl", "Brachialis & Forearm Thickness", "Neutral grip (palms face in) · Arm thickness", phase, tension, f, "Neutral Grip")

    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    elbow_y = cy + 30
    hand_y = cy + 65 - int(travel * 52)

    for side in [-1, 1]:
        brach = [(cx + side * 46, cy + 8), (cx + side * 64, cy + 16), (cx + side * 56, elbow_y + 10), (cx + side * 40, elbow_y)]
        draw_glowing_polygon(draw, brach, glow_intensity=tension, is_active=True)

        hx = cx + side * 46
        draw.line([(cx + side * 44, cy + 15), (cx + side * 46, elbow_y)], fill=BODY_BASE, width=12)
        draw.line([(cx + side * 46, elbow_y), (hx, hand_y)], fill=BODY_BASE, width=10)
        # Vertical Hex Dumbbell
        draw.line([(hx, hand_y - 14), (hx, hand_y + 14)], fill=CHROME, width=6)
        draw.rectangle([hx - 8, hand_y - 18, hx + 8, hand_y - 10], fill=BODY_SHADOW, outline=ORANGE, width=1)
        draw.rectangle([hx - 8, hand_y + 10, hx + 8, hand_y + 18], fill=BODY_SHADOW, outline=ORANGE, width=1)

    return im.convert("RGB")

def render_cable_crunch(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Spinal Flexion)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled Unroll)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 220
    create_studio_background(draw, "Kneeling Cable Crunch", "Rectus Abdominis (Abs)", "Roll spine like a carpet · Hips stay motionless", phase, tension, f, "Spine Flexion")

    # High cable pulley
    draw.ellipse([cx - 16, 50, cx + 16, 80], fill=CHROME, outline=ORANGE, width=2)

    # Spine bending down
    torso_drop = int(travel * 35)
    draw_head_and_neck(draw, cx, cy - 35 + torso_drop)
    draw_sculpted_torso(draw, cx, cy + torso_drop, abs_glow=tension)

    # Rope hands near ears
    hand_y = cy - 25 + torso_drop
    draw.line([(cx, 65), (cx - 18, hand_y)], fill=(180, 185, 195), width=2)
    draw.line([(cx, 65), (cx + 18, hand_y)], fill=(180, 185, 195), width=2)
    draw.ellipse([cx - 24, hand_y - 6, cx - 12, hand_y + 6], fill=ORANGE)
    draw.ellipse([cx + 12, hand_y - 6, cx + 24, hand_y + 6], fill=ORANGE)

    return im.convert("RGB")

def render_hanging_knee_raise(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Curling Pelvis Up)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled Lower)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 190
    create_studio_background(draw, "Hanging Knee Raise", "Lower Abdominals & Core", "Curl pelvis upward to chest · Zero body swing", phase, tension, f, "Pelvic Tilt")

    # Pull-up Bar
    draw.line([(cx - 110, 65), (cx + 110, 65)], fill=CHROME, width=7)

    # Arms hanging straight up
    draw.line([(cx - 44, cy + 15), (cx - 44, 68)], fill=BODY_BASE, width=11)
    draw.line([(cx + 44, cy + 15), (cx + 44, 68)], fill=BODY_BASE, width=11)
    draw_head_and_neck(draw, cx, cy - 10)
    draw_sculpted_torso(draw, cx, cy + 25, abs_glow=tension)

    # Knees lifting up
    knee_y = cy + 140 - int(travel * 48)
    for side in [-1, 1]:
        # Thigh
        draw.line([(cx + side * 18, cy + 120), (cx + side * 22, knee_y)], fill=BODY_BASE, width=12)
        # Shin
        draw.line([(cx + side * 22, knee_y), (cx + side * 20, knee_y + 35)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

# =========================================================================
# 3. LEGS & LOWER BODY EXERCISES
# =========================================================================

def render_leg_press(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Eccentric (Knees Bend to 90°)"
        travel = norm
        tension = 0.4 + 0.6 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Concentric (Press Sled Up)"
        travel = 1.0 - norm
        tension = 1.0 - 0.35 * norm

    cx, cy = WIDTH // 2, 220
    create_studio_background(draw, "45-Degree Incline Leg Press", "Quadriceps & Glute Drive", "Lower to 90° knee angle · Don't lock out violently", phase, tension, f, "90° Sled Depth")

    # Incline Sled Rails & Plate Sled
    sled_offset = int((1.0 - travel) * 45)
    sled_y = 120 + int(travel * 45)

    # Rails
    draw.line([(cx - 130, 80), (cx - 50, cy + 90)], fill=BENCH_STEEL, width=6)
    draw.line([(cx + 130, 80), (cx + 50, cy + 90)], fill=BENCH_STEEL, width=6)

    # 45° Sled Footplate with 20kg Orange Plates
    draw.rectangle([cx - 85, sled_y - 12, cx + 85, sled_y + 12], fill=STEEL_GRAY, outline=ORANGE, width=2)
    draw.ellipse([cx - 95, sled_y - 25, cx - 75, sled_y + 25], fill=BODY_SHADOW, outline=ORANGE, width=2)
    draw.ellipse([cx + 75, sled_y - 25, cx + 95, sled_y + 25], fill=BODY_SHADOW, outline=ORANGE, width=2)

    # Seated Athlete
    draw_head_and_neck(draw, cx, cy - 10)
    draw_sculpted_torso(draw, cx, cy + 25)

    # Legs & Quads glowing intensely
    knee_x_offset = int(travel * 28)
    for side in [-1, 1]:
        kx = cx + side * (55 + knee_x_offset)
        ky = cy + 45 + int(travel * 22)
        # Thigh / Quad glowing
        quad = [(cx + side * 22, cy + 85), (kx, ky), (kx - side * 14, ky + 10), (cx + side * 10, cy + 95)]
        draw_glowing_polygon(draw, quad, glow_intensity=tension, is_active=True)
        # Shin to foot on sled
        fx = cx + side * 40
        fy = sled_y + 5
        draw.line([(kx, ky), (fx, fy)], fill=BODY_BASE, width=12)
        draw.ellipse([fx - 8, fy - 6, fx + 8, fy + 6], fill=BODY_SHADOW)

    return im.convert("RGB")

def render_romanian_deadlift(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Eccentric (Hip Hinge Stretch)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Concentric (Drive Hips Forward)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Romanian Deadlift (RDL)", "Hamstrings & Glute Squeeze", "Push hips straight back · Bar skims down shins", phase, tension, f, "Hip Hinge")

    # Barbell height moving from hip down to mid-shin
    bar_y = cy + 30 + int(travel * 60)
    draw.line([(cx - 150, bar_y), (cx + 150, bar_y)], fill=CHROME, width=7)
    for px in [-140, -130, 130, 140]:
        draw.ellipse([px - 14, bar_y - 28, px + 14, bar_y + 28], fill=STEEL_GRAY, outline=ORANGE, width=2)

    # Torso hinging forward
    torso_drop = int(travel * 32)
    draw_head_and_neck(draw, cx, cy - 45 + torso_drop)
    draw_sculpted_torso(draw, cx, cy - 10 + torso_drop)

    # Hamstrings (Posterior chain) glowing
    for side in [-1, 1]:
        hx = cx + side * 22
        # Thigh with soft knee bend
        ham = [(hx - 10, cy + 70), (hx + 10, cy + 70), (hx + 8, cy + 120), (hx - 8, cy + 120)]
        draw_glowing_polygon(draw, ham, glow_intensity=tension, is_active=True)
        # Arms hanging holding bar
        draw.line([(cx + side * 44, cy + 5 + torso_drop), (cx + side * 65, bar_y)], fill=BODY_BASE, width=10)

    return im.convert("RGB")

def render_leg_extension(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Extend to Lockout)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled 3s Lower)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Seated Leg Extension", "Quadriceps (Teardrop Isolation)", "Point toes slightly up · Squeeze quads 1s at top", phase, tension, f, "Peak Contraction")

    # Machine Seat
    draw.rectangle([cx - 45, cy - 50, cx + 45, cy + 80], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx, cy - 35)
    draw_sculpted_torso(draw, cx, cy)

    # Quads glowing
    for side in [-1, 1]:
        quad = [(cx + side * 22, cy + 65), (cx + side * 34, cy + 95), (cx + side * 14, cy + 95), (cx + side * 8, cy + 65)]
        draw_glowing_polygon(draw, quad, glow_intensity=tension, is_active=True)

    # Shin pad swinging from vertical (down) to horizontal (up)
    swing_angle = (1.0 - travel) * (math.pi / 2 - 0.1)
    shin_len = 55
    for side in [-1, 1]:
        kx = cx + side * 24
        ky = cy + 95
        sx = kx + math.sin(swing_angle) * 8
        sy = ky + math.cos(swing_angle) * shin_len
        draw.line([(kx, ky), (sx, sy)], fill=BODY_BASE, width=12)
        # Shin roller pad
        draw.ellipse([sx - 12, sy - 8, sx + 12, sy + 8], fill=ORANGE)

    return im.convert("RGB")

def render_leg_curl(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Curl Heels to Glutes)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Controlled Return)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 215
    create_studio_background(draw, "Hamstring Leg Curl", "Biceps Femoris (Hamstrings)", "Keep hips glued to bench · Full knee curl", phase, tension, f, "Hamstring Peak")

    # Prone Bench
    draw.rectangle([cx - 90, cy + 30, cx + 90, cy + 65], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    draw_head_and_neck(draw, cx - 65, cy + 20)

    # Hamstrings glowing
    for side in [-1, 1]:
        ham = [(cx - 20, cy + 32 + side * 8), (cx + 30, cy + 32 + side * 8), (cx + 25, cy + 46 + side * 8), (cx - 20, cy + 46 + side * 8)]
        draw_glowing_polygon(draw, ham, glow_intensity=tension, is_active=True)

    # Shin curling upward towards glutes
    curl_angle = travel * (math.pi / 2 + 0.2)
    kx = cx + 32
    ky = cy + 42
    sx = kx - math.sin(curl_angle) * 45
    sy = ky - math.cos(curl_angle) * 45
    draw.line([(kx, ky), (sx, sy)], fill=BODY_BASE, width=11)
    draw.ellipse([sx - 10, sy - 10, sx + 10, sy + 10], fill=ORANGE)

    return im.convert("RGB")

def render_calf_raise(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase = "Concentric (Rise on Big Toes)"
        travel = norm
        tension = 0.35 + 0.65 * norm
    else:
        norm = (t - 0.5) / 0.5
        phase = "Eccentric (Deep Heel Stretch)"
        travel = 1.0 - norm
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    create_studio_background(draw, "Calf Raise", "Gastrocnemius & Soleus", "Pause 1s at deep bottom stretch · Drive through big toes", phase, tension, f, "Ankle Plantarflex")

    # Elevated Step Platform
    draw.rectangle([cx - 80, cy + 115, cx + 80, cy + 140], fill=BENCH_STEEL, outline=BORDER_COLOR, width=2)

    heel_offset = int((1.0 - travel) * 22) - 8  # drops below platform in eccentric, rises high in concentric
    draw_head_and_neck(draw, cx, cy - 45 - int(travel * 18))
    draw_sculpted_torso(draw, cx, cy - 10 - int(travel * 18))

    # Calves (Gastrocnemius diamond heads) glowing fiery orange
    for side in [-1, 1]:
        calf = [(cx + side * 24, cy + 65), (cx + side * 36, cy + 85), (cx + side * 22, cy + 110), (cx + side * 14, cy + 85)]
        draw_glowing_polygon(draw, calf, glow_intensity=tension, is_active=True)
        # Foot on platform edge with heel dropping / rising
        draw.line([(cx + side * 20, cy + 115), (cx + side * 24, cy + 115 + heel_offset)], fill=BODY_BASE, width=8)

    return im.convert("RGB")

def render_plank(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    t = f / N_FRAMES
    # Isometric pulsing tension
    tension = 0.75 + 0.25 * math.sin(t * 2 * math.pi)

    cx, cy = WIDTH // 2, 220
    create_studio_background(draw, "Core Isometric Plank", "Deep Transverse Abdominis & Glutes", "Straight spine head to heels · Squeeze glutes & brace", "Isometric Hold", tension, f, "Solid Line")

    # Floor Mat
    draw.rectangle([cx - 150, cy + 50, cx + 150, cy + 65], fill=(22, 24, 28), outline=ORANGE, width=1)

    # Prone Straight Body Line
    body_y = cy + 25
    # Head
    draw.ellipse([cx - 120, body_y - 20, cx - 85, body_y + 10], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Forearms on floor
    draw.line([(cx - 95, body_y + 12), (cx - 75, cy + 50)], fill=BODY_BASE, width=10)
    draw.line([(cx - 75, cy + 50), (cx - 50, cy + 50)], fill=BODY_BASE, width=8)

    # Core Torso glowing intensely
    core = [(cx - 85, body_y - 12), (cx + 25, body_y - 8), (cx + 25, body_y + 16), (cx - 85, body_y + 16)]
    draw_glowing_polygon(draw, core, glow_intensity=tension, is_active=True)

    # Legs & Glutes straight to toes
    draw.polygon([(cx + 25, body_y - 8), (cx + 120, body_y + 15), (cx + 120, body_y + 28), (cx + 25, body_y + 16)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Toes planted on mat
    draw.ellipse([cx + 115, cy + 44, cx + 128, cy + 54], fill=ORANGE)

    return im.convert("RGB")

# =========================================================================
# ALL 23 EXERCISES DIRECTORY MAP & ALIASES
# =========================================================================

EXERCISES_MAP = [
    # Push
    ("bench_press.gif", render_bench_press),
    ("incline_db_press.gif", render_incline_db_press),
    ("machine_chest_press.gif", render_machine_chest_press),
    ("cable_fly.gif", render_cable_fly),
    ("cable_chest_fly.gif", render_cable_fly),  # alias
    ("lateral_raise.gif", render_lateral_raise),
    ("db_lateral_raise.gif", render_lateral_raise),  # alias
    ("shoulder_press.gif", render_shoulder_press),
    ("seated_db_shoulder_press.gif", render_shoulder_press),  # alias
    ("triceps_pushdown.gif", render_triceps_pushdown),
    ("cable_triceps_pushdown.gif", render_triceps_pushdown),  # alias
    ("overhead_triceps_ext.gif", render_overhead_triceps_ext),
    ("overhead_cable_triceps_ext.gif", render_overhead_triceps_ext),  # alias

    # Pull
    ("lat_pulldown.gif", render_lat_pulldown),
    ("chest_supported_row.gif", render_chest_supported_row),
    ("seated_cable_row.gif", render_seated_cable_row),
    ("straight_arm_pulldown.gif", render_straight_arm_pulldown),
    ("reverse_pec_deck.gif", render_reverse_pec_deck),
    ("db_curl.gif", render_db_curl),
    ("hammer_curl.gif", render_hammer_curl),
    ("cable_crunch.gif", render_cable_crunch),
    ("hanging_knee_raise.gif", render_hanging_knee_raise),

    # Legs & Core
    ("leg_press.gif", render_leg_press),
    ("romanian_deadlift.gif", render_romanian_deadlift),
    ("rdl.gif", render_romanian_deadlift),  # alias
    ("leg_extension.gif", render_leg_extension),
    ("leg_curl.gif", render_leg_curl),
    ("calf_raise.gif", render_calf_raise),
    ("plank.gif", render_plank),
]

def main():
    print(f"Starting generation of {len(EXERCISES_MAP)} HQ exercise GIF loops...")
    print(f"Frame count: {N_FRAMES}, Duration per frame: {FRAME_DURATION}ms (~3.2s per rep)")

    for filename, render_func in EXERCISES_MAP:
        filepath = os.path.join(OUTPUT_DIR, filename)
        print(f"Rendering {filename} ({N_FRAMES} frames)...")
        frames = [render_func(f) for f in range(N_FRAMES)]
        frames[0].save(
            filepath,
            save_all=True,
            append_images=frames[1:],
            duration=FRAME_DURATION,
            loop=0,
            optimize=True
        )
        size_kb = os.path.getsize(filepath) / 1024
        print(f"-> Saved {filename} ({size_kb:.1f} KB)")

    print("\nSUCCESS: All exercise GIF loops successfully created!")

if __name__ == "__main__":
    main()
