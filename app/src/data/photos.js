export const PHOTOS = [
  { id: 1,  title: 'Golden Hour',      loc: 'Dhaka Rooftop',   cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(145deg,#c9a84c 0%,#8b4a1a 40%,#1a0d00 100%)' },
  { id: 2,  title: 'Still Waters',     loc: 'Buriganga River', cam: 'XT-30 ii', ar: '2/3',  g: 'linear-gradient(170deg,#0a1628 0%,#1a3a5c 55%,#2a5a7a 100%)' },
  { id: 3,  title: 'Urban Geometry',   loc: 'Old Dhaka',       cam: 'XH2S',    ar: '1/1',  g: 'linear-gradient(135deg,#1c1c1c 0%,#333 50%,#111 100%)' },
  { id: 4,  title: 'Monsoon Light',    loc: 'Sylhet',          cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(180deg,#0a1a0a 0%,#1a3a20 40%,#0d1f10 100%)' },
  { id: 5,  title: 'Portrait Study I', loc: 'Studio',          cam: 'XH2S',    ar: '2/3',  g: 'linear-gradient(160deg,#1a0f12 0%,#3d1e2a 60%,#5c1a30 100%)' },
  { id: 6,  title: 'Bokeh Study',      loc: 'Gulshan',         cam: 'XT-30 ii', ar: '4/3',  g: 'linear-gradient(120deg,#141428 0%,#2a1a4a 50%,#1a0d2e 100%)' },
  { id: 7,  title: 'Grain & Light',    loc: 'Cumilla',         cam: 'X100VI',  ar: '3/4',  g: 'linear-gradient(150deg,#2a1f14 0%,#5a4020 50%,#8b6030 100%)' },
  { id: 8,  title: 'Architecture',     loc: 'Motijheel',       cam: 'XH2S',    ar: '1/1',  g: 'linear-gradient(135deg,#0d1a2a 0%,#1a2d40 50%,#0a1520 100%)' },
  { id: 9,  title: 'Street Soul',      loc: 'Sadarghat',       cam: 'X100VI',  ar: '2/3',  g: 'linear-gradient(170deg,#1a1208 0%,#3a2810 50%,#6a4820 100%)' },
  { id: 10, title: 'Dawn',             loc: "Cox's Bazar",     cam: 'XT-30 ii', ar: '16/9', g: 'linear-gradient(180deg,#1a0a14 0%,#3a1a2a 40%,#5a2040 100%)' },
  { id: 11, title: 'Reflection',       loc: 'Hatirjheel',      cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(135deg,#071525 0%,#0f2a48 50%,#071a30 100%)' },
  { id: 12, title: 'The Market',       loc: 'Kawran Bazar',    cam: 'XH2S',    ar: '3/4',  g: 'linear-gradient(145deg,#1a1510 0%,#4a3520 50%,#7a5a30 100%)' },
];

export const HPHOTOS = PHOTOS.slice(0, 8);

export const ALL_PHOTOS = [
  { id: 1,  title: 'Golden Hour',       loc: 'Dhaka Rooftop',    cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(145deg,#c9a84c 0%,#8b4a1a 40%,#1a0d00 100%)',  tags: ['Street', 'Golden Hour'] },
  { id: 2,  title: 'Still Waters',      loc: 'Buriganga River',  cam: 'XT-30 ii', ar: '2/3',  g: 'linear-gradient(170deg,#0a1628 0%,#1a3a5c 55%,#2a5a7a 100%)',  tags: ['Landscape', 'Water'] },
  { id: 3,  title: 'Urban Geometry',    loc: 'Old Dhaka',        cam: 'XH2S',    ar: '1/1',  g: 'linear-gradient(135deg,#1c1c1c 0%,#333 50%,#111 100%)',         tags: ['Architecture', 'Street'] },
  { id: 4,  title: 'Monsoon Light',     loc: 'Sylhet',           cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(180deg,#0a1a0a 0%,#1a3a20 40%,#0d1f10 100%)',  tags: ['Landscape', 'Nature'] },
  { id: 5,  title: 'Portrait Study I',  loc: 'Studio',           cam: 'XH2S',    ar: '2/3',  g: 'linear-gradient(160deg,#1a0f12 0%,#3d1e2a 60%,#5c1a30 100%)',  tags: ['Portrait'] },
  { id: 6,  title: 'Bokeh Study',       loc: 'Gulshan',          cam: 'XT-30 ii', ar: '4/3',  g: 'linear-gradient(120deg,#141428 0%,#2a1a4a 50%,#1a0d2e 100%)',  tags: ['Street', 'Night'] },
  { id: 7,  title: 'Grain & Light',     loc: 'Cumilla',          cam: 'X100VI',  ar: '3/4',  g: 'linear-gradient(150deg,#2a1f14 0%,#5a4020 50%,#8b6030 100%)',  tags: ['Street', 'Golden Hour'] },
  { id: 8,  title: 'Architecture',      loc: 'Motijheel',        cam: 'XH2S',    ar: '1/1',  g: 'linear-gradient(135deg,#0d1a2a 0%,#1a2d40 50%,#0a1520 100%)',  tags: ['Architecture'] },
  { id: 9,  title: 'Street Soul',       loc: 'Sadarghat',        cam: 'X100VI',  ar: '2/3',  g: 'linear-gradient(170deg,#1a1208 0%,#3a2810 50%,#6a4820 100%)',  tags: ['Street'] },
  { id: 10, title: 'Dawn',              loc: "Cox's Bazar",      cam: 'XT-30 ii', ar: '16/9', g: 'linear-gradient(180deg,#1a0a14 0%,#3a1a2a 40%,#5a2040 100%)',  tags: ['Landscape', 'Golden Hour'] },
  { id: 11, title: 'Reflection',        loc: 'Hatirjheel',       cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(135deg,#071525 0%,#0f2a48 50%,#071a30 100%)',  tags: ['Water', 'Landscape'] },
  { id: 12, title: 'The Market',        loc: 'Kawran Bazar',     cam: 'XH2S',    ar: '3/4',  g: 'linear-gradient(145deg,#1a1510 0%,#4a3520 50%,#7a5a30 100%)',  tags: ['Street'] },
  { id: 13, title: 'Quiet Afternoon',   loc: 'Dhaka University', cam: 'XT-30 ii', ar: '4/3',  g: 'linear-gradient(130deg,#0f1a10 0%,#253a20 50%,#1a2a18 100%)',  tags: ['Nature', 'Landscape'] },
  { id: 14, title: 'Portrait Study II', loc: 'Studio',           cam: 'XH2S',    ar: '2/3',  g: 'linear-gradient(155deg,#200a0a 0%,#4a1a1a 60%,#6a2020 100%)',  tags: ['Portrait'] },
  { id: 15, title: 'Blue Hour',         loc: 'Dhanmondi Lake',   cam: 'X100VI',  ar: '3/4',  g: 'linear-gradient(165deg,#050d1a 0%,#0d1f3a 55%,#0a1530 100%)',  tags: ['Night', 'Water'] },
  { id: 16, title: 'Rooftop Dusk',      loc: 'Banani',           cam: 'X100VI',  ar: '4/3',  g: 'linear-gradient(160deg,#1a0a05 0%,#3a1a08 45%,#c9a84c33 100%)', tags: ['Street', 'Golden Hour'] },
  { id: 17, title: 'Monsoon Alley',     loc: 'Old Dhaka',        cam: 'XT-30 ii', ar: '2/3',  g: 'linear-gradient(170deg,#080e14 0%,#0f1e2a 55%,#081420 100%)',  tags: ['Street', 'Nature'] },
  { id: 18, title: 'Morning Chai',      loc: 'Wari',             cam: 'X100VI',  ar: '1/1',  g: 'linear-gradient(140deg,#1a1208 0%,#3a2810 50%,#5a3c18 100%)',  tags: ['Street'] },
  { id: 19, title: 'Fog & Fields',      loc: 'Manikganj',        cam: 'XT-30 ii', ar: '16/9', g: 'linear-gradient(180deg,#0a0f14 0%,#14202a 50%,#1a2a30 100%)',  tags: ['Landscape', 'Nature'] },
  { id: 20, title: 'Neon Nights',       loc: 'Motijheel',        cam: 'XH2S',    ar: '4/3',  g: 'linear-gradient(135deg,#0a0814 0%,#1a1030 50%,#2a103a 100%)',  tags: ['Night', 'Street'] },
  { id: 21, title: "Fisherman's Dawn",  loc: 'Padma River',      cam: 'X100VI',  ar: '3/4',  g: 'linear-gradient(150deg,#1a0e08 0%,#3a1e08 40%,#c9a84c22 100%)', tags: ['Water', 'Golden Hour'] },
  { id: 22, title: 'Concrete Dreams',   loc: 'Dhaka',            cam: 'XH2S',    ar: '1/1',  g: 'linear-gradient(135deg,#111 0%,#222 50%,#0a0a0a 100%)',         tags: ['Architecture'] },
  { id: 23, title: 'Sylhet Green',      loc: 'Sylhet',           cam: 'XT-30 ii', ar: '4/3',  g: 'linear-gradient(160deg,#061006 0%,#0f2010 50%,#1a3018 100%)',  tags: ['Nature', 'Landscape'] },
  { id: 24, title: 'Faces of Dhaka',    loc: 'Lalbagh',          cam: 'X100VI',  ar: '2/3',  g: 'linear-gradient(155deg,#1a1008 0%,#3a2010 55%,#5a3018 100%)',  tags: ['Portrait', 'Street'] },
];

export const FILTERS = ['All', 'Street', 'Portrait', 'Landscape', 'Architecture', 'Night', 'Golden Hour', 'Nature', 'Water'];

export const VIDEOS = [
  { id: 1, ytId: 'SPX0QwuXE1g', title: 'City After Dark',    dur: '4:32', loc: 'Dhaka',       g: 'linear-gradient(135deg,#08080e 0%,#14142a 100%)', featured: true },
  { id: 2, ytId: 'fmIexJ8BFHM', title: 'Monsoon Season',     dur: '6:18', loc: 'Sylhet',      g: 'linear-gradient(135deg,#080e08 0%,#142814 100%)' },
  { id: 3, ytId: 'G7RgN9ijwE4', title: 'Street Stories',     dur: '3:45', loc: 'Old Dhaka',   g: 'linear-gradient(135deg,#1a1208 0%,#3a2810 100%)' },
  { id: 4, ytId: 'psuRGfAaju4', title: 'Golden Hour Drive',  dur: '5:12', loc: "Cox's Bazar", g: 'linear-gradient(135deg,#1a0d00 0%,#3a2010 100%)' },
  { id: 5, ytId: 'TcMBFSGVi1c', title: 'Still Life',         dur: '2:58', loc: 'Studio',      g: 'linear-gradient(135deg,#0e0e0e 0%,#1e1e1e 100%)' },
  { id: 6, ytId: 'ZbZSe6N_BXs', title: 'Portraits of Dhaka', dur: '7:40', loc: 'Dhaka',       g: 'linear-gradient(135deg,#1a0808 0%,#2a1010 100%)' },
];
