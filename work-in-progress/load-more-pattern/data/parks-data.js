/**
 * In order to keep this example runnable out of the box, a JavaScript array
 * is used over a JSON file. A plain <script src="./data/parks-data.js">
 * works even when this page is opened directly from disk (file://), since
 * it just runs as a script and defines a global.
 *
 * Loading a JSON file instead would mean fetching it, e.g.
 * fetch('./data/parks-data.json').then(r => r.json()), and fetch() is
 * blocked by CORS under file://. That would require running this example
 * through at least a bare-bones local static server, which is outside the
 * scope of this example.
 */
const PARKS_DATA = [
  { name: 'Banff National Park', province: 'Alberta', description: "Canada's first national park, established in 1885 in the Rocky Mountains. Known for turquoise glacial lakes like Louise and Moraine, and the town of Banff itself." },
  { name: 'Jasper National Park', province: 'Alberta', description: 'The largest national park in the Canadian Rockies, home to the Icefields Parkway, Maligne Canyon, and some of the darkest skies on the continent.' },
  { name: 'Waterton Lakes National Park', province: 'Alberta', description: "A small park in southern Alberta that meets Montana's Glacier National Park at the border, forming the world's first International Peace Park." },
  { name: 'Elk Island National Park', province: 'Alberta', description: 'A fully fenced park near Edmonton with free-roaming bison herds and one of the highest densities of hoofed mammals anywhere in Canada.' },
  { name: 'Wood Buffalo National Park', province: 'Alberta / <abbr title="Northwest Territories">NWT</abbr>', description: "Canada's largest national park, home to the world's largest free-roaming bison herd and nesting grounds for the endangered whooping crane." },
  { name: 'Kootenay National Park', province: 'British Columbia', description: 'Spans the Continental Divide in the Rockies, known for hot springs at Radium and a dramatic canyon carved by Sinclair Creek.' },
  { name: 'Yoho National Park', province: 'British Columbia', description: "Small but dense with scenery, including Takakkaw Falls, one of Canada's tallest waterfalls, and the fossil-rich Burgess Shale." },
  { name: 'Glacier National Park', province: 'British Columbia', description: 'A mountainous park along the historic rail route through Rogers Pass, known for heavy snowfall and long-running avalanche research.' },
  { name: 'Mount Revelstoke National Park', province: 'British Columbia', description: 'A compact park known for subalpine meadows reachable by the Meadows in the Sky Parkway.' },
  { name: 'Pacific Rim National Park Reserve', province: 'British Columbia', description: "Vancouver Island's rugged Pacific coastline, covering surf beaches, rainforest trails, and the offshore Broken Group Islands." },
  { name: 'Gwaii Haanas National Park Reserve', province: 'British Columbia', description: 'A remote archipelago on Haida Gwaii, jointly managed with the Haida Nation, protecting ancient village sites and old-growth rainforest.' },
  { name: 'Gulf Islands National Park Reserve', province: 'British Columbia', description: 'A patchwork of small islands and islets in the Strait of Georgia, known for Garry oak ecosystems and sea kayaking.' },
  { name: 'Riding Mountain National Park', province: 'Manitoba', description: 'A forested highland rising above the prairie, home to a reintroduced bison herd and the historic Wasagaming townsite.' },
  { name: 'Wapusk National Park', province: 'Manitoba', description: 'A remote subarctic park along Hudson Bay, one of the largest known polar bear maternity denning areas in the world.' },
  { name: 'Fundy National Park', province: 'New Brunswick', description: 'Sits on the Bay of Fundy, famous for the highest tides in the world, exposing vast stretches of ocean floor at low tide.' },
  { name: 'Kouchibouguac National Park', province: 'New Brunswick', description: "Sandy beaches and lagoons along New Brunswick's east coast, with extensive trails through bog and salt marsh." },
  { name: 'Gros Morne National Park', province: 'Newfoundland and Labrador', description: 'A UNESCO World Heritage site known for the exposed mantle rock of the Tablelands and the fjord-like Western Brook Pond.' },
  { name: 'Terra Nova National Park', province: 'Newfoundland and Labrador', description: "Newfoundland's boreal coastline, with sheltered fjords, hiking trails, and seasonal whale and iceberg viewing." },
  { name: 'Torngat Mountains National Park', province: 'Newfoundland and Labrador', description: 'A remote, roadless park in northern Labrador, co-managed with Inuit, known for some of the oldest exposed rock on Earth.' },
  { name: 'Nahanni National Park Reserve', province: 'Northwest Territories', description: 'Wilderness around the South Nahanni River, home to the thundering Virginia Falls, far taller than Niagara.' },
  { name: 'Tuktut Nogait National Park', province: 'Northwest Territories', description: 'Remote Arctic tundra protecting calving grounds for the Bluenose-West caribou herd.' },
  { name: 'Kluane National Park and Reserve', province: 'Yukon', description: "Home to Mount Logan, Canada's highest peak, and one of the largest non-polar icefields in the world." },
  { name: 'Kejimkujik National Park', province: 'Nova Scotia', description: 'An inland park known for canoe routes, dark night skies, and Mi\u2019kmaq petroglyphs.' },
  { name: 'Cape Breton Highlands National Park', province: 'Nova Scotia', description: 'A rugged coastal plateau traversed by the Cabot Trail, with steep sea cliffs and highland forest.' },
  { name: 'Sable Island National Park Reserve', province: 'Nova Scotia', description: 'A narrow sandbar far off the coast, famous for its wild horses and a large grey seal colony.' },
  { name: 'Auyuittuq National Park', province: 'Nunavut', description: 'An Arctic park on Baffin Island whose name means "the land that never melts," home to glaciers and the Akshayuk Pass.' },
  { name: 'Sirmilik National Park', province: 'Nunavut', description: 'Northern Baffin Island park with dramatic ice caps, fjords, and major seabird colonies.' },
  { name: 'Point Pelee National Park', province: 'Ontario', description: "Canada's southernmost mainland point, a narrow marshy peninsula that's a major stopover for migrating birds and monarch butterflies." },
  { name: 'Bruce Peninsula National Park', province: 'Ontario', description: 'Sits on the Niagara Escarpment, known for turquoise waters, sea caves, and the Grotto along Georgian Bay.' },
  { name: 'Prince Edward Island National Park', province: 'Prince Edward Island', description: "Red sandstone cliffs and dune beaches along PEI's north shore, including the Greenwich dune system." },
  { name: 'Grasslands National Park', province: 'Saskatchewan', description: 'One of the last remaining stretches of native mixed-grass prairie in Canada, home to black-tailed prairie dogs and a dark-sky preserve.' },
  { name: 'La Mauricie National Park', province: 'Quebec', description: 'A rolling, lake-dotted Laurentian landscape popular for canoeing and fall foliage.' },
];