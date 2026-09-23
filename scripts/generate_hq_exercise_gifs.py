import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "public/exercises"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 560, 420
N_FRAMES = 24
ORANGE = (238, 77, 0)
ORANGE_BRIGHT = (255, 120, 20)
ORANGE_GLOW = (255, 80, 0, 90)
ORANGE_CORE = (255, 230, 200)
DARK_BG = (8, 8, 10)
CARD_BG = (17, 17, 20)
BODY_BASE = (38, 42, 52)
BODY_SHADOW = (22, 25, 32)
BODY_HIGHLIGHT = (65, 72, 88)
STEEL_GRAY = (140, 145, 155)
CHROME = (210, 215, 225)
BENCH_LEATHER = (24, 24, 28)
BENCH_STEEL = (45, 48, 55)

# Embers seed
np.random.seed(1337)
EMBERS = []
for _ in range(30):
    EMBERS.append({
        'x': np.random.uniform(0.05, 0.95) * WIDTH,
        'y': np.random.uniform(0.1, 0.95) * HEIGHT,
        'speed': np.random.uniform(2.5, 6.0),
        'size': np.random.uniform(1.5, 3.5),
        'alpha': np.random.uniform(0.35, 0.9),
        'drift': np.random.uniform(-1.0, 1.0)
    })

def create_studio_background(draw, exercise_title, target_muscle, phase_text, progress_pct, f):
    # Radial studio floor spotlight
    cx, cy = WIDTH // 2, HEIGHT // 2 + 30
    for r in range(220, 40, -15):
        alpha = int(12 * (1.0 - r / 220.0))
        draw.ellipse([cx - r * 1.3, cy - r * 0.7, cx + r * 1.3, cy + r * 0.7], fill=(238, 77, 0, alpha))
    
    # Perspective grid lines on floor
    floor_y = 280
    for gx in range(40, WIDTH, 50):
        # vanishing perspective lines towards center
        top_gx = cx + int((gx - cx) * 0.45)
        draw.line([(top_gx, floor_y - 20), (gx, HEIGHT - 35)], fill=(30, 32, 40, 80), width=1)
    for gy in [floor_y - 10, floor_y + 25, floor_y + 65, floor_y + 100]:
        draw.line([(40, gy), (WIDTH - 40, gy)], fill=(32, 34, 42, 70), width=1)

    # Floating fiery orange embers
    t = f / N_FRAMES
    for emb in EMBERS:
        ey = (emb['y'] - f * emb['speed'] * 4.0) % (HEIGHT - 70) + 40
        ex = emb['x'] + math.sin(t * 2 * math.pi + emb['drift']) * 7
        rad = emb['size']
        ea = int(255 * emb['alpha'] * (0.6 + 0.4 * math.sin(t * 2 * math.pi + emb['speed'])))
        draw.ellipse([ex - rad*2, ey - rad*2, ex + rad*2, ey + rad*2], fill=(238, 77, 0, ea // 4))
        draw.ellipse([ex - rad, ey - rad, ex + rad, ey + rad], fill=(255, 150, 40, ea))

    # Top HUD Bar
    draw.rectangle([0, 0, WIDTH, 44], fill=(12, 12, 16, 230))
    draw.line([(0, 44), (WIDTH, 44)], fill=(238, 77, 0, 180), width=2)
    
    # Top Left Badge & Title
    draw.rectangle([16, 12, 110, 32], fill=(238, 77, 0, 40), outline=(238, 77, 0, 160), width=1)
    draw.text((24, 16), "GYM X 3D HD", fill=(238, 77, 0))
    draw.text((120, 15), exercise_title.upper(), fill=(255, 255, 255))
    
    # Top Right Contraction Indicator
    draw.rectangle([WIDTH - 150, 12, WIDTH - 16, 32], fill=(20, 22, 28, 200), outline=(50, 55, 68), width=1)
    # Animated progress bar
    bar_w = int(128 * progress_pct)
    draw.rectangle([WIDTH - 147, 15, WIDTH - 147 + bar_w, 29], fill=(238, 77, 0))
    draw.text((WIDTH - 138, 17), "ACTIVE TENSION", fill=(255, 255, 255))

    # Bottom HUD Bar
    draw.rectangle([0, HEIGHT - 36, WIDTH, HEIGHT], fill=(12, 12, 16, 230))
    draw.line([(0, HEIGHT - 36), (WIDTH, HEIGHT - 36)], fill=(38, 38, 43), width=1)
    draw.text((20, HEIGHT - 26), f"TARGET: {target_muscle.upper()}", fill=(180, 185, 195))
    draw.text((WIDTH - 210, HEIGHT - 26), f"PHASE: {phase_text.upper()}", fill=(238, 77, 0))

def draw_glowing_polygon(draw, points, glow_intensity=1.0, is_active=True):
    """Draws anatomical muscle region with smooth shading and active glow"""
    if is_active and glow_intensity > 0.15:
        # Multi-layer neon bloom
        for pad in [8, 5, 2]:
            g_alpha = int(45 * glow_intensity * (1.0 - pad / 10.0))
            if len(points) >= 3:
                # expand points slightly for halo
                cx = sum(p[0] for p in points) / len(points)
                cy = sum(p[1] for p in points) / len(points)
                halo = [(cx + (p[0] - cx) * (1.0 + pad * 0.08), cy + (p[1] - cy) * (1.0 + pad * 0.08)) for p in points]
                draw.polygon(halo, fill=(238, 77, 0, g_alpha))
        
        # Saturated muscle belly
        fill_r = int(BODY_BASE[0] + (ORANGE[0] - BODY_BASE[0]) * glow_intensity)
        fill_g = int(BODY_BASE[1] + (ORANGE[1] - BODY_BASE[1]) * glow_intensity)
        fill_b = int(BODY_BASE[2] + (ORANGE[2] - BODY_BASE[2]) * glow_intensity)
        draw.polygon(points, fill=(fill_r, fill_g, fill_b, 255), outline=(255, 140, 50, int(220 * glow_intensity)), width=2)
    else:
        draw.polygon(points, fill=BODY_BASE, outline=BODY_HIGHLIGHT, width=1)

def draw_head_and_neck(draw, cx, cy):
    # Head cranium & jaw
    draw.ellipse([cx - 18, cy - 60, cx + 18, cy - 20], fill=BODY_BASE, outline=BODY_HIGHLIGHT, width=1)
    # Jaw taper
    draw.polygon([(cx - 13, cy - 35), (cx + 13, cy - 35), (cx + 6, cy - 18), (cx - 6, cy - 18)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Neck
    draw.polygon([(cx - 10, cy - 20), (cx + 10, cy - 20), (cx + 14, cy - 5), (cx - 14, cy - 5)], fill=BODY_SHADOW, outline=BODY_HIGHLIGHT)
    # Trapezius slope
    draw.polygon([(cx - 36, cy - 5), (cx - 14, cy - 5), (cx - 10, cy - 20)], fill=BODY_SHADOW)
    draw.polygon([(cx + 36, cy - 5), (cx + 14, cy - 5), (cx + 10, cy - 20)], fill=BODY_SHADOW)

def draw_sculpted_torso(draw, cx, cy, chest_glow=0.0, delts_glow=0.0, triceps_glow=0.0):
    # Clavicles
    draw.line([(cx - 45, cy), (cx, cy + 6)], fill=BODY_HIGHLIGHT, width=2)
    draw.line([(cx + 45, cy), (cx, cy + 6)], fill=BODY_HIGHLIGHT, width=2)
    
    # Pectoralis Major - Left (Sternal + Clavicular)
    pec_l = [(cx - 4, cy + 8), (cx - 44, cy + 2), (cx - 48, cy + 26), (cx - 32, cy + 42), (cx - 4, cy + 40)]
    draw_glowing_polygon(draw, pec_l, glow_intensity=chest_glow, is_active=True)
    
    # Pectoralis Major - Right
    pec_r = [(cx + 4, cy + 8), (cx + 44, cy + 2), (cx + 48, cy + 26), (cx + 32, cy + 42), (cx + 4, cy + 40)]
    draw_glowing_polygon(draw, pec_r, glow_intensity=chest_glow, is_active=True)
    
    # Sternum divider line
    draw.line([(cx, cy + 6), (cx, cy + 42)], fill=(20, 20, 25), width=2)
    
    # Rectus Abdominis (6-Pack)
    for i in range(3):
        ay = cy + 48 + i * 16
        # Left pack
        draw.rounded_rectangle([cx - 22, ay, cx - 3, ay + 13], radius=3, fill=BODY_SHADOW, outline=BODY_HIGHLIGHT, width=1)
        # Right pack
        draw.rounded_rectangle([cx + 3, ay, cx + 22, ay + 13], radius=3, fill=BODY_SHADOW, outline=BODY_HIGHLIGHT, width=1)
        
    # Serratus anterior (rib contours)
    for i in range(3):
        sy = cy + 42 + i * 14
        draw.line([(cx - 44 + i * 4, sy), (cx - 26, sy + 6)], fill=BODY_HIGHLIGHT, width=1)
        draw.line([(cx + 44 - i * 4, sy), (cx + 26, sy + 6)], fill=BODY_HIGHLIGHT, width=1)
        
    # Waist & hips
    draw.polygon([(cx - 36, cy + 96), (cx + 36, cy + 96), (cx + 28, cy + 124), (cx - 28, cy + 124)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)

# -------------------------------------------------------------
# 1. BARBELL BENCH PRESS
# -------------------------------------------------------------
def render_bench_press_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    # Rep kinematics: Eccentric down (0.0 to 0.5), Concentric push (0.5 to 1.0)
    if t < 0.5:
        # Lowering to chest
        norm = t / 0.5
        phase_str = "Eccentric Stretch (Lowering)"
        bar_y_offset = int(norm * 45) # 0 to 45 down
        tension = 0.35 + 0.65 * norm
    else:
        # Pressing up to lockout
        norm = (t - 0.5) / 0.5
        phase_str = "Concentric Explosion (Lockout)"
        bar_y_offset = int((1.0 - norm) * 45)
        tension = 1.0 - 0.4 * norm

    cx, cy = WIDTH // 2, 210
    
    create_studio_background(draw, "Barbell Bench Press", "Mid & Sternal Pectoralis", phase_str, tension, f)
    
    # Flat Bench Structure
    draw.rectangle([cx - 55, cy - 80, cx + 55, cy + 130], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    # Bench legs & crossbar
    draw.rectangle([cx - 65, cy + 120, cx + 65, cy + 135], fill=BENCH_STEEL)
    draw.line([(cx - 50, cy - 75), (cx - 50, cy + 125)], fill=(40, 42, 48), width=1)
    draw.line([(cx + 50, cy - 75), (cx + 50, cy + 125)], fill=(40, 42, 48), width=1)

    # Athlete lying supine
    # Head at top
    draw_head_and_neck(draw, cx, cy - 35)
    # Muscular torso
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension, delts_glow=tension * 0.4, triceps_glow=tension * 0.5)
    
    # Upper Arms & Forearms holding barbell
    # Arm kinematics based on barbell height
    elbow_out_x = 75 + int(bar_y_offset * 0.4)
    elbow_y = cy + 20 + bar_y_offset
    hand_y = cy - 10 + bar_y_offset
    
    # Left Deltoid & Bicep/Tricep
    delts_l = [(cx - 45, cy), (cx - 68, cy + 4), (cx - 72, cy + 24), (cx - 46, cy + 24)]
    draw_glowing_polygon(draw, delts_l, glow_intensity=tension * 0.5, is_active=True)
    # Upper arm to elbow
    draw.polygon([(cx - 48, cy + 16), (cx - elbow_out_x, elbow_y), (cx - elbow_out_x + 16, elbow_y + 8), (cx - 44, cy + 32)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Forearm up to hand
    draw.polygon([(cx - elbow_out_x, elbow_y), (cx - 65, hand_y), (cx - 52, hand_y), (cx - elbow_out_x + 16, elbow_y + 8)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    
    # Right Deltoid & Arm
    delts_r = [(cx + 45, cy), (cx + 68, cy + 4), (cx + 72, cy + 24), (cx + 46, cy + 24)]
    draw_glowing_polygon(draw, delts_r, glow_intensity=tension * 0.5, is_active=True)
    draw.polygon([(cx + 48, cy + 16), (cx + elbow_out_x, elbow_y), (cx + elbow_out_x - 16, elbow_y + 8), (cx + 44, cy + 32)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    draw.polygon([(cx + elbow_out_x, elbow_y), (cx + 65, hand_y), (cx + 52, hand_y), (cx + elbow_out_x - 16, elbow_y + 8)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)

    # Olympic Barbell Assembly
    bar_y = hand_y
    # Steel Bar
    draw.line([(cx - 180, bar_y), (cx + 180, bar_y)], fill=CHROME, width=7)
    draw.line([(cx - 180, bar_y - 1), (cx + 180, bar_y - 1)], fill=(255, 255, 255), width=2)
    # Knurling pattern
    draw.rectangle([cx - 85, bar_y - 4, cx - 40, bar_y + 4], fill=STEEL_GRAY)
    draw.rectangle([cx + 40, bar_y - 4, cx + 85, bar_y + 4], fill=STEEL_GRAY)
    # Collars
    draw.rectangle([cx - 145, bar_y - 8, cx - 138, bar_y + 8], fill=(60, 65, 75))
    draw.rectangle([cx + 138, bar_y - 8, cx + 145, bar_y + 8], fill=(60, 65, 75))
    # 20kg Olympic Bumper Plates (Left & Right)
    for p_offset in [146, 162]:
        # Left plate
        draw.rectangle([cx - p_offset - 12, bar_y - 48, cx - p_offset, bar_y + 48], fill=(24, 25, 30), outline=(238, 77, 0), width=2)
        draw.line([(cx - p_offset - 6, bar_y - 40), (cx - p_offset - 6, bar_y + 40)], fill=(238, 77, 0), width=1)
        # Right plate
        draw.rectangle([cx + p_offset, bar_y - 48, cx + p_offset + 12, bar_y + 48], fill=(24, 25, 30), outline=(238, 77, 0), width=2)
        draw.line([(cx + p_offset + 6, bar_y - 40), (cx + p_offset + 6, bar_y + 40)], fill=(238, 77, 0), width=1)
        
    # Hands gripping bar
    draw.rounded_rectangle([cx - 68, bar_y - 8, cx - 50, bar_y + 8], radius=4, fill=(50, 55, 68), outline=BODY_HIGHLIGHT)
    draw.rounded_rectangle([cx + 50, bar_y - 8, cx + 68, bar_y + 8], radius=4, fill=(50, 55, 68), outline=BODY_HIGHLIGHT)

    return im.convert("RGB")

# -------------------------------------------------------------
# 2. INCLINE DUMBBELL PRESS
# -------------------------------------------------------------
def render_incline_db_press_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Deep Clavicular Stretch"
        travel = norm
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Converging Clavicular Squeeze"
        travel = 1.0 - norm

    tension = 0.4 + 0.6 * (1.0 - travel)
    cx, cy = WIDTH // 2, 220
    
    create_studio_background(draw, "Incline Dumbbell Press", "Upper Clavicular Pectoralis", phase_str, tension, f)

    # 30-degree incline bench backrest
    draw.polygon([(cx - 45, cy - 85), (cx + 45, cy - 85), (cx + 40, cy + 130), (cx - 40, cy + 130)], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    
    # Head & Neck (seated inclined)
    draw_head_and_neck(draw, cx, cy - 35)
    
    # Torso with Upper Chest Emphasis
    draw_sculpted_torso(draw, cx, cy, chest_glow=tension, delts_glow=tension * 0.65)
    
    # Dumbbells kinematics (converging path: wide at bottom, touching at top)
    db_dist = int(55 + travel * 45) # 55 close at top, 100 wide at bottom
    db_y = cy - 25 + int(travel * 55) # high at top, lower at bottom
    
    # Left Dumbbell & Arm
    elbow_lx = cx - 55 - int(travel * 35)
    elbow_ly = cy + 25 + int(travel * 30)
    draw.polygon([(cx - 44, cy + 10), (elbow_lx, elbow_ly), (elbow_lx + 15, elbow_ly + 10), (cx - 40, cy + 30)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    draw.polygon([(elbow_lx, elbow_ly), (cx - db_dist, db_y), (cx - db_dist + 16, db_y), (elbow_lx + 15, elbow_ly + 10)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Left Hex Dumbbell
    draw.line([(cx - db_dist - 14, db_y), (cx - db_dist + 14, db_y)], fill=CHROME, width=5)
    draw.rectangle([cx - db_dist - 28, db_y - 18, cx - db_dist - 14, db_y + 18], fill=(30, 32, 40), outline=(238, 77, 0), width=2)
    draw.rectangle([cx - db_dist + 14, db_y - 18, cx - db_dist + 28, db_y + 18], fill=(30, 32, 40), outline=(238, 77, 0), width=2)
    # Hand
    draw.rounded_rectangle([cx - db_dist - 8, db_y - 8, cx - db_dist + 8, db_y + 8], radius=3, fill=(50, 55, 68), outline=BODY_HIGHLIGHT)

    # Right Dumbbell & Arm
    elbow_rx = cx + 55 + int(travel * 35)
    elbow_ry = cy + 25 + int(travel * 30)
    draw.polygon([(cx + 44, cy + 10), (elbow_rx, elbow_ry), (elbow_rx - 15, elbow_ry + 10), (cx + 40, cy + 30)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    draw.polygon([(elbow_rx, elbow_ry), (cx + db_dist, db_y), (cx + db_dist - 16, db_y), (elbow_rx - 15, elbow_ry + 10)], fill=BODY_BASE, outline=BODY_HIGHLIGHT)
    # Right Hex Dumbbell
    draw.line([(cx + db_dist - 14, db_y), (cx + db_dist + 14, db_y)], fill=CHROME, width=5)
    draw.rectangle([cx + db_dist - 28, db_y - 18, cx + db_dist - 14, db_y + 18], fill=(30, 32, 40), outline=(238, 77, 0), width=2)
    draw.rectangle([cx + db_dist + 14, db_y - 18, cx + db_dist + 28, db_y + 18], fill=(30, 32, 40), outline=(238, 77, 0), width=2)
    # Hand
    draw.rounded_rectangle([cx + db_dist - 8, db_y - 8, cx + db_dist + 8, db_y + 8], radius=3, fill=(50, 55, 68), outline=BODY_HIGHLIGHT)

    return im.convert("RGB")

# -------------------------------------------------------------
# 3. MACHINE CHEST PRESS
# -------------------------------------------------------------
def render_machine_chest_press_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Negative Eccentric Control"
        travel = norm
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Concentric Full Extension"
        travel = 1.0 - norm

    tension = 0.35 + 0.65 * (1.0 - travel)
    cx, cy = WIDTH // 2, 215

    create_studio_background(draw, "Machine Chest Press", "Pectoralis Major & Triceps", phase_str, tension, f)

    # Machine Frame (Heavy commercial steel cage)
    draw.rectangle([cx - 150, 70, cx - 140, 330], fill=BENCH_STEEL)
    draw.rectangle([cx + 140, 70, cx + 150, 330], fill=BENCH_STEEL)
    draw.line([(cx - 145, 80), (cx + 145, 80)], fill=BENCH_STEEL, width=6)
    
    # Weight Stack Pin Guide Rods (Left side)
    draw.rectangle([cx - 200, 110, cx - 165, 300], fill=(20, 22, 26), outline=BENCH_STEEL, width=1)
    for stk in range(10):
        sy = 125 + stk * 16
        draw.rectangle([cx - 195, sy, cx - 170, sy + 12], fill=(45, 48, 56), outline=(25, 26, 30))
    # Active Selector Pin
    draw.line([(cx - 170, 125 + 5 * 16 + 6), (cx - 155, 125 + 5 * 16 + 6)], fill=(238, 77, 0), width=3)

    # Seat backrest
    draw.rectangle([cx - 40, cy - 70, cx + 40, cy + 110], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    
    # Athlete
    draw_head_and_neck(draw, cx, cy - 25)
    draw_sculpted_torso(draw, cx, cy + 10, chest_glow=tension, triceps_glow=tension * 0.6)
    
    # Machine Lever Arms (converging pivoting linkage)
    handle_x_offset = int(60 + travel * 25)
    handle_y = cy + 20 + int(travel * 30)
    
    # Machine pivot arms
    draw.line([(cx - 140, 140), (cx - handle_x_offset, handle_y)], fill=(80, 85, 95), width=6)
    draw.line([(cx + 140, 140), (cx + handle_x_offset, handle_y)], fill=(80, 85, 95), width=6)
    
    # Handles & Hands
    draw.rectangle([cx - handle_x_offset - 4, handle_y - 15, cx - handle_x_offset + 4, handle_y + 15], fill=CHROME)
    draw.rounded_rectangle([cx - handle_x_offset - 8, handle_y - 8, cx - handle_x_offset + 8, handle_y + 8], radius=3, fill=(50, 55, 68))
    
    draw.rectangle([cx + handle_x_offset - 4, handle_y - 15, cx + handle_x_offset + 4, handle_y + 15], fill=CHROME)
    draw.rounded_rectangle([cx + handle_x_offset - 8, handle_y - 8, cx + handle_x_offset + 8, handle_y + 8], radius=3, fill=(50, 55, 68))

    return im.convert("RGB")

# -------------------------------------------------------------
# 4. CABLE CHEST FLY
# -------------------------------------------------------------
def render_cable_chest_fly_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Eccentric Chest Stretch"
        travel = norm # 0 = peak squeeze, 1 = deep fly stretch
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Peak Adduction Squeeze"
        travel = 1.0 - norm

    tension = 0.3 + 0.7 * (1.0 - travel)
    cx, cy = WIDTH // 2, 210

    create_studio_background(draw, "Cable Chest Fly", "Pectoralis Major (Sternal Peak)", phase_str, tension, f)

    # Dual Cable Pulley Towers
    # Left Tower & Pulley
    draw.rectangle([15, 60, 45, 330], fill=BENCH_STEEL)
    draw.ellipse([35, 90, 65, 120], fill=CHROME, outline=(238, 77, 0), width=2)
    # Right Tower & Pulley
    draw.rectangle([WIDTH - 45, 60, WIDTH - 15, 330], fill=BENCH_STEEL)
    draw.ellipse([WIDTH - 65, 90, WIDTH - 35, 120], fill=CHROME, outline=(238, 77, 0), width=2)

    # Athlete Standing Athletic Stance
    draw_head_and_neck(draw, cx, cy - 40)
    draw_sculpted_torso(draw, cx, cy - 5, chest_glow=tension)
    
    # Arm kinematics in hugging fly motion
    # wide stretch: hand_x at +-160, peak squeeze: hand_x at +-20
    hand_x_l = cx - int(24 + travel * 135)
    hand_y = cy + 20 + int(travel * 25)
    hand_x_r = cx + int(24 + travel * 135)
    
    # Steel Cables from Pulleys to Hands
    draw.line([(50, 105), (hand_x_l, hand_y)], fill=(190, 195, 205), width=2)
    draw.line([(WIDTH - 50, 105), (hand_x_r, hand_y)], fill=(190, 195, 205), width=2)
    
    # Arms (Curved embracing arc)
    elbow_l_x = (cx - 45 + hand_x_l) // 2 - int(25 * (1.0 - travel))
    elbow_l_y = cy + int(travel * 10)
    draw.line([(cx - 45, cy), (elbow_l_x, elbow_l_y), (hand_x_l, hand_y)], fill=BODY_BASE, width=12)
    draw.line([(cx - 45, cy), (elbow_l_x, elbow_l_y), (hand_x_l, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    
    elbow_r_x = (cx + 45 + hand_x_r) // 2 + int(25 * (1.0 - travel))
    elbow_r_y = cy + int(travel * 10)
    draw.line([(cx + 45, cy), (elbow_r_x, elbow_r_y), (hand_x_r, hand_y)], fill=BODY_BASE, width=12)
    draw.line([(cx + 45, cy), (elbow_r_x, elbow_r_y), (hand_x_r, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    
    # Stirrup Handles
    draw.ellipse([hand_x_l - 8, hand_y - 8, hand_x_l + 8, hand_y + 8], outline=CHROME, width=2)
    draw.ellipse([hand_x_r - 8, hand_y - 8, hand_x_r + 8, hand_y + 8], outline=CHROME, width=2)

    return im.convert("RGB")

# -------------------------------------------------------------
# 5. DUMBBELL LATERAL RAISE
# -------------------------------------------------------------
def render_db_lateral_raise_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Abduction to Parallel"
        travel = norm # 0 = down, 1 = 90 deg horizontal raise
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Controlled Descent"
        travel = 1.0 - norm

    tension = 0.25 + 0.75 * travel
    cx, cy = WIDTH // 2, 210

    create_studio_background(draw, "Dumbbell Lateral Raise", "Lateral Deltoid (Side Head)", phase_str, tension, f)

    # Athlete Standing
    draw_head_and_neck(draw, cx, cy - 45)
    
    # Torso with Flaming Fiery Orange Lateral Deltoids
    draw_sculpted_torso(draw, cx, cy - 10, chest_glow=0.2, delts_glow=tension)
    
    # Lateral raise arm angle (0 = down at sides, 1 = 90 deg abduction)
    angle_rad = travel * (math.pi / 2.1)
    arm_len = 110
    
    hand_lx = cx - 45 - int(math.sin(angle_rad) * arm_len)
    hand_ly = cy - 5 + int(math.cos(angle_rad) * arm_len)
    
    hand_rx = cx + 45 + int(math.sin(angle_rad) * arm_len)
    hand_ry = cy - 5 + int(math.cos(angle_rad) * arm_len)
    
    # Left Deltoid Cap Glowing Orange
    delts_l = [(cx - 45, cy - 8), (cx - 68, cy - 4), (cx - 72, cy + 18), (cx - 46, cy + 18)]
    draw_glowing_polygon(draw, delts_l, glow_intensity=tension, is_active=True)
    # Left Arm
    draw.line([(cx - 48, cy), (hand_lx, hand_ly)], fill=BODY_BASE, width=13)
    draw.line([(cx - 48, cy), (hand_lx, hand_ly)], fill=BODY_HIGHLIGHT, width=2)
    # Left Hex Dumbbell
    draw.line([(hand_lx - 10, hand_ly), (hand_lx + 10, hand_ly)], fill=CHROME, width=5)
    draw.rectangle([hand_lx - 20, hand_ly - 12, hand_lx - 10, hand_ly + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    draw.rectangle([hand_lx + 10, hand_ly - 12, hand_lx + 20, hand_ly + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    
    # Right Deltoid Cap Glowing Orange
    delts_r = [(cx + 45, cy - 8), (cx + 68, cy - 4), (cx + 72, cy + 18), (cx + 46, cy + 18)]
    draw_glowing_polygon(draw, delts_r, glow_intensity=tension, is_active=True)
    # Right Arm
    draw.line([(cx + 48, cy), (hand_rx, hand_ry)], fill=BODY_BASE, width=13)
    draw.line([(cx + 48, cy), (hand_rx, hand_ry)], fill=BODY_HIGHLIGHT, width=2)
    # Right Hex Dumbbell
    draw.line([(hand_rx - 10, hand_ry), (hand_rx + 10, hand_ry)], fill=CHROME, width=5)
    draw.rectangle([hand_rx - 20, hand_ry - 12, hand_rx - 10, hand_ry + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    draw.rectangle([hand_rx + 10, hand_ry - 12, hand_rx + 20, hand_ry + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)

    return im.convert("RGB")

# -------------------------------------------------------------
# 6. SEATED DUMBBELL SHOULDER PRESS
# -------------------------------------------------------------
def render_seated_db_shoulder_press_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Overhead Extension (Lockout)"
        travel = norm # 0 = at shoulder level, 1 = overhead lockout
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Controlled Eccentric Lowering"
        travel = 1.0 - norm

    tension = 0.35 + 0.65 * travel
    cx, cy = WIDTH // 2, 230

    create_studio_background(draw, "Seated Dumbbell Shoulder Press", "Anterior & Lateral Deltoids", phase_str, tension, f)

    # 75-degree high back gym bench
    draw.rectangle([cx - 40, cy - 65, cx + 40, cy + 105], fill=BENCH_LEATHER, outline=BENCH_STEEL, width=2)
    
    # Athlete Seated
    draw_head_and_neck(draw, cx, cy - 20)
    draw_sculpted_torso(draw, cx, cy + 20, chest_glow=0.2, delts_glow=tension, triceps_glow=tension * 0.7)
    
    # Dumbbell press kinematics
    # start: db_y at cy, wide at +-75. top: db_y at cy - 90, converging at +-38
    db_y = cy - int(travel * 95)
    db_x_offset = int(72 - travel * 32)
    
    # Left Arm & Dumbbell
    draw.line([(cx - 45, cy + 15), (cx - db_x_offset, db_y)], fill=BODY_BASE, width=12)
    draw.line([(cx - 45, cy + 15), (cx - db_x_offset, db_y)], fill=BODY_HIGHLIGHT, width=2)
    # Left DB
    draw.line([(cx - db_x_offset - 14, db_y), (cx - db_x_offset + 14, db_y)], fill=CHROME, width=5)
    draw.rectangle([cx - db_x_offset - 26, db_y - 12, cx - db_x_offset - 14, db_y + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    draw.rectangle([cx - db_x_offset + 14, db_y - 12, cx - db_x_offset + 26, db_y + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    
    # Right Arm & Dumbbell
    draw.line([(cx + 45, cy + 15), (cx + db_x_offset, db_y)], fill=BODY_BASE, width=12)
    draw.line([(cx + 45, cy + 15), (cx + db_x_offset, db_y)], fill=BODY_HIGHLIGHT, width=2)
    # Right DB
    draw.line([(cx + db_x_offset - 14, db_y), (cx + db_x_offset + 14, db_y)], fill=CHROME, width=5)
    draw.rectangle([cx + db_x_offset - 26, db_y - 12, cx + db_x_offset - 14, db_y + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)
    draw.rectangle([cx + db_x_offset + 14, db_y - 12, cx + db_x_offset + 26, db_y + 12], fill=(28, 30, 36), outline=(238, 77, 0), width=2)

    return im.convert("RGB")

# -------------------------------------------------------------
# 7. CABLE TRICEPS PUSHDOWN
# -------------------------------------------------------------
def render_cable_triceps_pushdown_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Concentric Extension (Lockout)"
        travel = norm # 0 = 90 deg flexed, 1 = full extension down
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Eccentric Triceps Stretch"
        travel = 1.0 - norm

    tension = 0.3 + 0.7 * travel
    cx, cy = WIDTH // 2, 210

    create_studio_background(draw, "Cable Triceps Pushdown", "Triceps Brachii (Lateral & Medial)", phase_str, tension, f)

    # Overhead Cable Station Pulley
    draw.rectangle([cx - 30, 48, cx + 30, 68], fill=BENCH_STEEL)
    draw.ellipse([cx - 18, 62, cx + 18, 98], fill=CHROME, outline=(238, 77, 0), width=2)
    
    # Athlete Standing Profile / 3/4 View
    draw_head_and_neck(draw, cx, cy - 45)
    draw_sculpted_torso(draw, cx, cy - 10, chest_glow=0.15, triceps_glow=tension)

    # Pinched Elbows at Ribcage
    elbow_y = cy + 25
    # Forearm kinematics: 90 deg (travel=0 -> hand_y at cy+25) to Full Extension (travel=1 -> hand_y at cy+85)
    hand_y = cy + 25 + int(travel * 60)
    
    # Cable from Pulley to Straight Bar Attachment
    draw.line([(cx, 80), (cx, hand_y - 8)], fill=(200, 205, 215), width=2)
    
    # Triceps Lateral Horseshoe glowing fiery orange
    tricep_l = [(cx - 46, cy), (cx - 62, cy + 6), (cx - 56, elbow_y), (cx - 42, elbow_y - 6)]
    draw_glowing_polygon(draw, tricep_l, glow_intensity=tension, is_active=True)
    tricep_r = [(cx + 46, cy), (cx + 62, cy + 6), (cx + 56, elbow_y), (cx + 42, elbow_y - 6)]
    draw_glowing_polygon(draw, tricep_r, glow_intensity=tension, is_active=True)
    
    # Forearms extending down to bar
    draw.line([(cx - 44, elbow_y), (cx - 20, hand_y)], fill=BODY_BASE, width=10)
    draw.line([(cx - 44, elbow_y), (cx - 20, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    draw.line([(cx + 44, elbow_y), (cx + 20, hand_y)], fill=BODY_BASE, width=10)
    draw.line([(cx + 44, elbow_y), (cx + 20, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    
    # Straight Cable Attachment Bar
    draw.line([(cx - 36, hand_y), (cx + 36, hand_y)], fill=CHROME, width=6)
    draw.rectangle([cx - 40, hand_y - 5, cx - 36, hand_y + 5], fill=(238, 77, 0))
    draw.rectangle([cx + 36, hand_y - 5, cx + 40, hand_y + 5], fill=(238, 77, 0))
    
    # Hands gripping bar
    draw.rounded_rectangle([cx - 24, hand_y - 6, cx - 12, hand_y + 6], radius=3, fill=(50, 55, 68))
    draw.rounded_rectangle([cx + 12, hand_y - 6, cx + 24, hand_y + 6], radius=3, fill=(50, 55, 68))

    return im.convert("RGB")

# -------------------------------------------------------------
# 8. OVERHEAD CABLE TRICEPS EXTENSION
# -------------------------------------------------------------
def render_overhead_cable_triceps_ext_frame(f):
    im = Image.new("RGBA", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(im)
    
    t = f / N_FRAMES
    if t < 0.5:
        norm = t / 0.5
        phase_str = "Overhead Extension (Peak Long-Head)"
        travel = norm # 0 = flexed behind head, 1 = extended overhead forward
    else:
        norm = (t - 0.5) / 0.5
        phase_str = "Deep Long-Head Stretch"
        travel = 1.0 - norm

    tension = 0.35 + 0.65 * travel
    cx, cy = WIDTH // 2, 220

    create_studio_background(draw, "Overhead Cable Triceps Ext", "Triceps Brachii (Long Head)", phase_str, tension, f)

    # Athlete in athletic staggered lunge stance leaning forward
    draw_head_and_neck(draw, cx, cy - 25)
    draw_sculpted_torso(draw, cx, cy + 15, chest_glow=0.15, triceps_glow=tension)

    # Overhead pulley cable behind
    draw.line([(cx, cy - 100), (cx, cy - 50)], fill=(200, 205, 215), width=2)
    
    # Elbows pointing upward / forward
    elbow_y = cy - 35
    hand_y = cy - 45 - int(travel * 55)
    hand_spread = int(14 + travel * 28)
    
    # Triceps Long Head along upper arm glowing fiery orange
    tricep_l = [(cx - 40, cy + 5), (cx - 52, cy - 15), (cx - 45, elbow_y), (cx - 32, elbow_y)]
    draw_glowing_polygon(draw, tricep_l, glow_intensity=tension, is_active=True)
    tricep_r = [(cx + 40, cy + 5), (cx + 52, cy - 15), (cx + 45, elbow_y), (cx + 32, elbow_y)]
    draw_glowing_polygon(draw, tricep_r, glow_intensity=tension, is_active=True)
    
    # Forearms extending overhead
    draw.line([(cx - 36, elbow_y), (cx - hand_spread, hand_y)], fill=BODY_BASE, width=10)
    draw.line([(cx - 36, elbow_y), (cx - hand_spread, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    draw.line([(cx + 36, elbow_y), (cx + hand_spread, hand_y)], fill=BODY_BASE, width=10)
    draw.line([(cx + 36, elbow_y), (cx + hand_spread, hand_y)], fill=BODY_HIGHLIGHT, width=2)
    
    # Rope attachment balls & handles
    draw.ellipse([cx - hand_spread - 8, hand_y - 8, cx - hand_spread + 8, hand_y + 8], fill=(238, 77, 0))
    draw.ellipse([cx + hand_spread - 8, hand_y - 8, cx + hand_spread + 8, hand_y + 8], fill=(238, 77, 0))

    return im.convert("RGB")

# -------------------------------------------------------------
# GENERATE ALL 8 HQ EXERCISE GIFS
# -------------------------------------------------------------
EXERCISES = [
    ("bench_press.gif", render_bench_press_frame),
    ("incline_db_press.gif", render_incline_db_press_frame),
    ("machine_chest_press.gif", render_machine_chest_press_frame),
    ("cable_chest_fly.gif", render_cable_chest_fly_frame),
    ("db_lateral_raise.gif", render_db_lateral_raise_frame),
    ("seated_db_shoulder_press.gif", render_seated_db_shoulder_press_frame),
    ("cable_triceps_pushdown.gif", render_cable_triceps_pushdown_frame),
    ("overhead_cable_triceps_ext.gif", render_overhead_cable_triceps_ext_frame),
]

def main():
    for filename, render_func in EXERCISES:
        filepath = os.path.join(OUTPUT_DIR, filename)
        print(f"Rendering {filename} (24 frames)...")
        frames = [render_func(f) for f in range(N_FRAMES)]
        frames[0].save(
            filepath,
            save_all=True,
            append_images=frames[1:],
            duration=75,
            loop=0,
            optimize=True
        )
        print(f"-> Successfully saved {filepath} ({os.path.getsize(filepath)} bytes)")

if __name__ == "__main__":
    main()
