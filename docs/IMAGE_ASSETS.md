# Image Asset Pipeline

## Directory Structure

```
public/images/items/
├── weapons/          # Guns, bows, melee
├── abilities/        # Ability cards
├── roles/            # Role licenses (bounty, trader, etc.)
├── horses/           # Horse breeds
├── saddles/          # Saddles and stirrups
├── tools/            # Wagons, detectors, equipment
├── pamphlets/        # Recipe pamphlets
└── camp/             # Camp upgrades
```

## File Naming Convention

Format: `{descriptive_name}.webp`

| Catalog ID | Image Path |
|------------|------------|
| `w_rev_navy` | `/images/items/weapons/navy_revolver.webp` |
| `w_rep_lancaster` | `/images/items/weapons/lancaster_repeater.webp` |
| `w_rif_bolt` | `/images/items/weapons/bolt_action_rifle.webp` |
| `w_rif_varmint` | `/images/items/weapons/varmint_rifle.webp` |
| `w_rif_carcano` | `/images/items/weapons/carcano_rifle.webp` |
| `w_sg_pump` | `/images/items/weapons/pump_action_shotgun.webp` |
| `w_bow_improved` | `/images/items/weapons/improved_bow.webp` |
| `w_rev_lemat` | `/images/items/weapons/lemat_revolver.webp` |
| `w_pst_mauser` | `/images/items/weapons/mauser_pistol.webp` |
| `a_de_pib` | `/images/items/abilities/paint_it_black.webp` |
| `a_pc_ss` | `/images/items/abilities/sharpshooter.webp` |
| `a_pd_il` | `/images/items/abilities/iron_lung.webp` |
| `a_pd_fmo` | `/images/items/abilities/fool_me_once.webp` |
| `a_pr_sm` | `/images/items/abilities/strange_medicine.webp` |
| `a_de_sns` | `/images/items/abilities/slow_and_steady.webp` |
| `r_lic_bh` | `/images/items/roles/bounty_hunter.webp` |
| `r_lic_tr` | `/images/items/roles/trader.webp` |
| `r_lic_col` | `/images/items/roles/collector.webp` |
| `u_col_det` | `/images/items/tools/metal_detector.webp` |
| `u_col_sho` | `/images/items/tools/shovel.webp` |
| `u_trd_wagL` | `/images/items/tools/large_wagon.webp` |
| `u_trd_hunt` | `/images/items/tools/hunting_wagon.webp` |
| `u_moon_cop` | `/images/items/tools/copper_still.webp` |
| `u_nat_camp` | `/images/items/camp/wilderness_camp.webp` |
| `h_red_arab` | `/images/items/horses/arabian_red.webp` |
| `h_mft` | `/images/items/horses/missouri_fox_trotter.webp` |
| `h_turk` | `/images/items/horses/turkoman.webp` |
| `h_mus` | `/images/items/horses/mustang_buckskin.webp` |
| `s_naco` | `/images/items/saddles/nacogdoches.webp` |
| `t_stir` | `/images/items/saddles/hooded_stirrups.webp` |
| `p_ft_wild` | `/images/items/pamphlets/wilderness_fast_travel.webp` |
| `p_ammo_exp` | `/images/items/pamphlets/explosive_ammo.webp` |
| `c_ft_post` | `/images/items/camp/fast_travel_post.webp` |

## Image Requirements

### Dimensions
- **Standard**: 128x128px (catalog thumbnails)
- **@2x Retina**: 256x256px (optional, append `@2x` to filename)

### Format Priority
1. **WebP** (primary) - 80% quality, best compression
2. **PNG** (fallback) - For browsers without WebP support

### Optimization Commands

```bash
# Convert PNG to WebP (requires cwebp)
cwebp -q 80 input.png -o output.webp

# Batch convert with ImageMagick
magick mogrify -format webp -quality 80 -resize 128x128 *.png

# Generate @2x variants
for file in *.webp; do
  name="${file%.webp}"
  magick "$file" -resize 256x256 "${name}@2x.webp"
done
```

### Sharp (Node.js) Alternative

```javascript
import sharp from 'sharp';

// Convert and resize
await sharp('input.png')
  .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 80 })
  .toFile('output.webp');
```

## ItemImage Component

The `ItemImage` component handles:
- Lazy loading via Intersection Observer
- WebP → PNG fallback
- Loading shimmer animation
- Error state with icon placeholder

Usage:
```jsx
<ItemImage 
  src={item.image}  // e.g., "/images/items/weapons/navy_revolver.webp"
  alt={item.name}
  size={64}
  className="rounded-lg"
/>
```

## Image Sources

### Official Assets
- Rockstar Social Club screenshots
- RDR2 wiki (attribution required)

### Community Resources
- [RDO.GG](https://rdo.gg) - Item databases
- [JeanRopke Map](https://jeanropke.github.io/RDR2CollectorsMap/)

### Creating Custom Assets
1. Screenshot in-game with consistent lighting
2. Remove background (transparent PNG)
3. Resize to 128x128 / 256x256
4. Convert to WebP at 80% quality
5. Place in appropriate category folder

## Build Integration

Vite automatically:
- Fingerprints assets for cache busting
- Compresses during production build
- Serves from `/images/` path

The `vite-imagetools` plugin can further optimize on import:
```javascript
import navyRevolver from '/images/items/weapons/navy_revolver.webp?w=128&format=webp';
```
