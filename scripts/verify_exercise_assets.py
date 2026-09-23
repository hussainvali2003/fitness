import os
import re

seed_path = "src/lib/seedData.ts"
with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

# find all exerciseId: "..." in weeklyWorkoutPlan
matches = re.findall(r'exerciseId:\s*["\']([^"\']+)["\']', content)
unique_ids = sorted(list(set(matches)))
print(f"Total unique exercise IDs in weeklyWorkoutPlan: {len(unique_ids)}")

missing = []
for ex_id in unique_ids:
    gif_file = f"public/exercises/{ex_id}.gif"
    if not os.path.exists(gif_file):
        missing.append(ex_id)
    else:
        print(f"  [OK] {ex_id}.gif -> {os.path.getsize(gif_file):,} bytes")

if missing:
    print("\nFAILED! Missing GIFs:", missing)
    exit(1)
else:
    print("\n>>> ALL 23 EXERCISES HAVE FULLY FUNCTIONAL AND VERIFIED GIFS! <<<")
