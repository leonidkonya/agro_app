"use client"

import { useState } from "react"

const recommendationSections = [
  {
    id: "crop-rotation",
    title: "Crop Rotation Plan",
    content: `
1. Year 1 (Current Year): Corn
   - Plant drought-resistant corn varieties
   - Apply 180 lbs N/acre, split into pre-planting and side-dressing applications
   - Implement integrated pest management for corn rootworm and European corn borer

2. Year 2: Soybeans
   - Choose a variety suitable for your region
   - Inoculate seeds with Bradyrhizobium japonicum before planting
   - Monitor for soybean cyst nematode and sudden death syndrome

3. Year 3: Winter Wheat
   - Plant in early fall after soybean harvest
   - Apply 30-60 lbs N/acre at planting and 50-80 lbs N/acre in spring
   - Scout for wheat rust and Fusarium head blight

4. Year 4: Cover Crops (e.g., clover or vetch)
   - Plant immediately after wheat harvest
   - Terminate cover crop 2-3 weeks before planting next year's corn
   - Soil test to determine nutrient contribution from cover crop

5. Return to Year 1 and repeat the cycle
`,
  },
  {
    id: "crop-planning",
    title: "Crop Planning",
    content: `
1. Variety Selection:
   - Choose drought-resistant corn hybrid: 'DroughtGuard 5140' or 'AquaMax 4825'
   - Expected yield: 180-200 bushels per acre under optimal conditions

2. Planting:
   - Target planting date: April 15-30
   - Seeding rate: 32,000 seeds per acre
   - Row spacing: 30 inches

3. Fertilization Plan:
   - Pre-planting: Apply 70 lbs N/acre, 60 lbs P2O5/acre, 80 lbs K2O/acre
   - Side-dress: Apply 110 lbs N/acre when corn is at V6 stage

4. Pest Management:
   - Scout fields weekly for pest presence
   - Apply 'Herculex XTRA' trait for corn rootworm protection
   - Use 'Bt' trait for European corn borer control

5. Irrigation:
   - Install soil moisture sensors at 12" and 24" depths
   - Irrigate when soil moisture at 12" depth falls below 50% of field capacity
`,
  },
  {
    id: "pre-cultivation",
    title: "Pre-cultivation Activities",
    content: `
1. Soil Preparation (2-3 weeks before planting):
   - Perform deep tillage to a depth of 12 inches to break up compacted layers
   - Apply lime if soil pH is below 6.0 (refer to soil test results)
   - Target pH range: 6.0-6.5 for optimal nutrient availability

2. Soil Amendment (1-2 weeks before planting):
   - Incorporate 2-3 tons per acre of well-composted organic matter
   - Use a disc harrow to mix organic matter into the top 6 inches of soil

3. Seedbed Preparation (1 week before planting):
   - Use a field cultivator to create a smooth, firm seedbed
   - Ensure soil particles are no larger than 1 inch in diameter

4. Pre-emergence Herbicide Application (1-3 days before planting):
   - Apply a pre-emergence herbicide mix of S-metolachlor and mesotrione
   - Use a rate of 2.5 pints per acre in 15-20 gallons of water

5. Equipment Preparation (1-2 days before planting):
   - Calibrate the planter for correct seed depth (1.5-2 inches) and spacing
   - Check and replace worn planter parts as needed
`,
  },
  {
    id: "post-cultivation",
    title: "Post-cultivation Activities",
    content: `
1. Emergence Monitoring (5-10 days after planting):
   - Check for uniform emergence and stand establishment
   - Target population: 30,000-31,000 plants per acre

2. Early-season Weed Control (2-3 weeks after planting):
   - Scout for weed pressure and species
   - If necessary, apply post-emergence herbicide (e.g., glyphosate for 'Roundup Ready' corn)

3. Nitrogen Side-dressing (V6 stage, about 4-5 weeks after planting):
   - Apply 110 lbs N/acre as anhydrous ammonia or UAN solution
   - Use a side-dress applicator or coulter-injection system

4. Irrigation Management (throughout growing season):
   - Monitor soil moisture sensors weekly
   - Irrigate to maintain soil moisture between 50-70% of field capacity
   - Critical periods: V8-VT (tassel emergence) and R1 (silking) stages

5. Pest and Disease Scouting (weekly, starting 3 weeks after planting):
   - Scout for corn rootworm, European corn borer, and foliar diseases
   - Apply foliar fungicide at VT-R1 stage if disease pressure is high

6. Harvest Preparation (2-3 weeks before estimated harvest date):
   - Monitor grain moisture content (target: 23-25% for early harvest)
   - Service and calibrate the combine
   - Prepare grain storage facilities and drying equipment
`,
  },
  {
    id: "fertilizer",
    title: "Fertilizer Recommendations",
    content: `
1. Nitrogen (N) - Total: 180 lbs/acre
   - Pre-plant: 70 lbs N/acre as anhydrous ammonia
   - Side-dress: 110 lbs N/acre as UAN solution at V6 stage

2. Phosphorus (P2O5) - Total: 60 lbs/acre
   - Apply all at pre-plant as triple superphosphate (0-45-0)

3. Potassium (K2O) - Total: 80 lbs/acre
   - Apply all at pre-plant as potassium chloride (0-0-60)

4. Sulfur (S) - Total: 20 lbs/acre
   - Apply with pre-plant fertilizer as ammonium sulfate

5. Zinc (Zn) - Total: 2 lbs/acre
   - Apply with pre-plant fertilizer as zinc sulfate

6. Timing and Method:
   - Pre-plant application: Incorporate into soil 2-3 weeks before planting
   - Side-dress N: Inject 4-6 inches deep, 6-8 inches from the row

7. Soil Testing and Adjustment:
   - Conduct comprehensive soil tests every 2-3 years
   - Adjust fertilizer rates based on soil test results and crop removal rates
`,
  },
  {
    id: "pesticide",
    title: "Pesticide Recommendations",
    content: `
1. Pre-emergence Herbicide:
   - Product: Dual II Magnum + Atrazine
   - Rate: 1.5 pints/acre Dual II Magnum + 1.5 lbs/acre Atrazine
   - Timing: Apply 1-3 days before planting
   - Target: Annual grasses and small-seeded broadleaf weeds

2. Post-emergence Herbicide:
   - Product: Roundup PowerMax (for Roundup Ready corn)
   - Rate: 32 fl oz/acre
   - Timing: Apply at V4-V8 stage, before weeds exceed 4 inches in height
   - Target: Broad spectrum weed control

3. Corn Rootworm Control:
   - Use Bt-traited corn hybrid (e.g., Genuity SmartStax RIB Complete)
   - Rotate to non-host crop (soybeans) the following year

4. European Corn Borer Control:
   - Use Bt-traited corn hybrid (e.g., Genuity SmartStax RIB Complete)
   - Scout fields weekly from V6 stage through tasseling

5. Foliar Fungicide:
   - Product: Headline AMP
   - Rate: 10 fl oz/acre
   - Timing: Apply at VT-R1 stage if disease pressure warrants
   - Target: Gray leaf spot, Northern corn leaf blight, Southern rust

6. Integrated Pest Management (IPM) Practices:
   - Implement crop rotation to break pest cycles
   - Use economic thresholds to guide pesticide applications
   - Preserve beneficial insects by avoiding unnecessary pesticide use
   - Rotate modes of action to prevent resistance development

7. Safety and Environmental Considerations:
   - Follow all label instructions and wear appropriate PPE
   - Maintain buffer zones near water bodies and sensitive areas
   - Calibrate sprayer before each application
   - Dispose of pesticide containers properly
`,
  },
]

export default function AIRecommendations() {
  const [selectedSection, setSelectedSection] = useState(recommendationSections[0])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Recommendation Topics</h2>
          <ul className="space-y-2">
            {recommendationSections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setSelectedSection(section)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedSection.id === section.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">{selectedSection.title}</h2>
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{selectedSection.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

