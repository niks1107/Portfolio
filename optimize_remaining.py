from PIL import Image, ExifTags
import os

def optimize(src_path, dst_path, max_dim=1600):
    img = Image.open(src_path)
    try:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == "Orientation":
                break
        exif = img._getexif()
        if exif and orientation in exif:
            if exif[orientation] == 3:
                img = img.rotate(180, expand=True)
            elif exif[orientation] == 6:
                img = img.rotate(270, expand=True)
            elif exif[orientation] == 8:
                img = img.rotate(90, expand=True)
    except Exception:
        pass
    w, h = img.size
    if max(w, h) > max_dim:
        ratio = max_dim / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(dst_path, "JPEG", quality=85, optimize=True)
    kb = os.path.getsize(dst_path) / 1024
    print(f"OK {os.path.basename(dst_path)} ({img.size[0]}x{img.size[1]}, {kb:.0f}KB)")

src = "captured_filmmaking"
dst = "public/gallery"

# Missing from last batch
optimize(os.path.join(src, "005.JPG"), os.path.join(dst, "edited-post-2.jpg"))

# Additional images not yet included
extras = [
    ("R5S00748.JPG", "model-portrait-3.jpg"),
    ("R5S00752.JPG", "model-portrait-4.jpg"),
    ("R5S08977.JPG", "creative-portrait-4.jpg"),
    ("R5S08994.JPG", "creative-portrait-5.jpg"),
    ("R5S09005.JPG", "creative-portrait-6.jpg"),
    ("R5S00756.JPG", "model-landscape-3.jpg"),
    ("02.JPG", "edited-post-4.jpg"),
    ("03.JPG", "edited-post-5.jpg"),
    ("07.JPG", "edited-post-6.jpg"),
    ("IMG_9981.JPG", "square-portrait-1.jpg"),
    ("SAVE_20231029_241918_Original.jpg", "candid-portrait-1.jpg"),
    ("SAVE_20231101_020008_Original.jpg", "candid-portrait-2.jpg"),
    ("IMG_20231103_020739_308_Original.jpg", "square-portrait-2.jpg"),
]

for sname, dname in extras:
    sp = os.path.join(src, sname)
    dp = os.path.join(dst, dname)
    if not os.path.exists(dp):
        try:
            optimize(sp, dp)
        except Exception as e:
            print(f"FAIL {sname}: {e}")
