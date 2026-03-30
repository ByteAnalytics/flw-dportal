

const STATUS_OPTIONS = [
  "Validated",
  "Draft",
  "Pending",
  "Approved",
  "Rejected",
];

const PF_NON_FINANCIALS_SECTIONS = [
  {
    title: "FINANCIAL STRENGTH",
    fields: [
      {
        key: "marketConditions",
        label: "Market Conditions",
        options: [
          {
            label:
              "Demand for the project's output is strong and growing. Demand is highly inelastic; price volatility can easily be passed on to consumers. Few competing suppliers with substantial and durable advantage",
            value: "100",
          },
          {
            label:
              "There is strong and fairly inelastic demand for the project's output. Few competing suppliers; the Company owns the largest market share for the supply of similar product",
            value: "75",
          },
          {
            label:
              "Average demand for the project's output. Few competing suppliers or average location, cost, and/or technology advantage; but this situation may not last",
            value: "50",
          },
          {
            label:
              "Demand is weak. Project has slightly less-than-average location, cost, or technology advantage",
            value: "25",
          },
          {
            label:
              "Demand for the project output is very weak and declining. Project has poor location, cost, or technology advantage",
            value: "0",
          },
        ],
      },
      {
        key: "abilityToMeetObligations",
        label: "Ability to Meet Obligations Under Stressed Scenarios",
        options: [
          {
            label:
              "The project can meet its financial obligations under sustained, severely stressed economic or sectoral conditions",
            value: "100",
          },
          {
            label:
              "The project can meet its financial obligations under moderately stressed conditions. Only likely to default under severe economic conditions",
            value: "75",
          },
          {
            label:
              "The project can meet its financial obligations under mildly stressed conditions. Only likely to default under severe conditions",
            value: "50",
          },
          {
            label:
              "The project is vulnerable to stresses that are not uncommon through an economic cycle, and may default in a normal downturn",
            value: "0",
          },
        ],
      },
      {
        key: "predictabilityOfNetCashflow",
        label: "Predictability of Net Cash Flows",
        options: [
          {
            label:
              "Very high degree of predictability. Contracted net cash flows have no material volume/price risk. Long history of generating stable net cash flows",
            value: "100",
          },
          {
            label:
              "Good degree of predictability. Contracted net cash flows have moderate volume/price risk. Fairly certain and stable net cash flows",
            value: "75",
          },
          {
            label:
              "Some degree of uncertainty. Contracted net cash flows have notable volume/price risk. Uncertain and volatile net cash flows exposed to economic cycles",
            value: "50",
          },
          {
            label:
              "Material uncertainty. Limited contracted net cash flows with material volume/price risk. Highly exposed to economic cycles",
            value: "25",
          },
          {
            label:
              "Unknown, zero or negative net cash flows. No contracted net cash flows or exposed to potential termination",
            value: "0",
          },
        ],
      },
      {
        key: "durationOfCreditVsProject",
        label: "Duration of Credit Compared to Duration of Project",
        options: [
          {
            label:
              "Very High; Useful life of the project significantly exceeds tenor of the loan, e.g. by more than 7 years",
            value: "100",
          },
          {
            label:
              "High; Useful life of the project considerably exceeds tenor of the loan, e.g. by 5 to 7 years",
            value: "75",
          },
          {
            label:
              "Moderate; Useful life of the project moderately exceeds tenor of the loan, e.g. by 3 to 5 years",
            value: "50",
          },
          {
            label:
              "Low; Useful life of the project slightly exceeds tenor of the loan, e.g. by 1 to 3 years",
            value: "25",
          },
          {
            label:
              "Very low; Useful life of the project may not exceed tenor of the loan",
            value: "0",
          },
        ],
      },
      {
        key: "amortisationSchedule",
        label: "Amortisation Schedule",
        options: [
          {
            label:
              "Amortizing debt repayments based on full quarterly amortization. No bullet payment at end of loan tenor",
            value: "100",
          },
          {
            label:
              "Amortizing debt repayments based on full half-yearly amortization. No bullet payment at end of loan tenor",
            value: "75",
          },
          {
            label:
              "Amortizing debt repayments, e.g. yearly repayments with repayment skewed to the end of loan tenor",
            value: "50",
          },
          {
            label:
              "Periodic interest payment with bullet repayment (principal amount) at the end of the loan tenor",
            value: "25",
          },
          {
            label:
              "Full bullet repayment (principal and interest), e.g. zero-coupon bonds",
            value: "0",
          },
        ],
      },
      {
        key: "subordinatedDebt",
        label: "Subordinated Debt",
        options: [
          {
            label:
              "Presence of subordinated debt from multinational institutions",
            value: "100",
          },
          { label: "No subordinated debt", value: "0" },
        ],
      },
    ],
  },
  {
    title: "POLITICAL AND REGULATORY FACTORS",
    fields: [
      {
        key: "acquisitionOfApprovals",
        label: "Acquisition of All Necessary Supports and Approvals",
        options: [
          { label: "All necessary approvals have been obtained", value: "100" },
          {
            label:
              "Most of the approvals (especially major approvals) are already in place along with very high probability of obtaining remaining approvals",
            value: "75",
          },
          {
            label:
              "Some approvals (including some major approvals) in place with a high probability of getting remaining approvals",
            value: "50",
          },
          {
            label:
              "Few approvals in place with medium probability of getting remaining approvals (especially major approvals)",
            value: "25",
          },
          {
            label:
              "No approvals in place and very low chance of obtaining the necessary support and approval",
            value: "0",
          },
        ],
      },
      {
        key: "stabilityOfLegalAndRegulatoryEnvironment",
        label: "Stability of Legal and Regulatory Environment",
        options: [
          {
            label:
              "Very stable regulatory environment lasting well beyond the life of project",
            value: "100",
          },
          {
            label:
              "Favourable and stable regulatory environment lasting as long as the tenor of the project",
            value: "75",
          },
          {
            label:
              "Regulatory changes may be unpredictable but it is not likely to adversely impact the project",
            value: "50",
          },
          {
            label:
              "Regulatory changes are unpredictable and such unpredictability is considered adverse for business",
            value: "25",
          },
          {
            label:
              "Current and/or future regulatory issues may significantly impact the project negatively",
            value: "0",
          },
        ],
      },
      {
        key: "enforceabilityOfContracts",
        label: "Enforceability of Contracts, Collateral and Security",
        options: [
          {
            label: "Contracts, collateral and security are enforceable",
            value: "100",
          },
          {
            label:
              "Contracts, collateral and security are considered enforceable even if certain non key issues may exist",
            value: "50",
          },
          {
            label:
              "There are unresolved key issues in respect of actual enforcement of contracts, collateral and security",
            value: "0",
          },
        ],
      },
      {
        key: "governmentSupport",
        label: "Government Support",
        options: [
          {
            label:
              "The project is of strategic importance for the country and receives adequate government support",
            value: "100",
          },
          {
            label:
              "The project may not be strategic but brings unquestionable benefits for the country and receives adequate government support",
            value: "75",
          },
          {
            label:
              "The project may not be strategic but brings unquestionable benefits for the country and receives some level of support from the government",
            value: "50",
          },
          {
            label:
              "The project is not a key project to the country. Weak support from Government",
            value: "25",
          },
          {
            label:
              "No form of support shown by the Government towards this project type",
            value: "0",
          },
        ],
      },
      {
        key: "politicalRisk",
        label: "Political Risks",
        options: [
          {
            label:
              "Very low exposure to political risk; strong mitigation instruments (e.g. government risk guarantees or political risk insurance)",
            value: "100",
          },
          {
            label:
              "Low exposure to political risk; satisfactory mitigation instruments (e.g. government risk guarantees or political risk insurance)",
            value: "75",
          },
          {
            label:
              "Moderate exposure; fair mitigation instruments (e.g. risk guarantees or political risk insurance)",
            value: "50",
          },
          {
            label:
              "High exposure; few / weak mitigation instruments (e.g. risk guarantees or political risk insurance)",
            value: "25",
          },
          {
            label: "Very high exposure; no mitigation instruments",
            value: "0",
          },
        ],
      },
      {
        key: "forceMajeure",
        label: "Force Majeure",
        options: [
          {
            label:
              "Very low exposure to any force majeure risk. Little to suggest that any force majeure risk may crystallize",
            value: "100",
          },
          {
            label:
              "Low exposure to force majeure risk. All risks relating to the project are accounted for",
            value: "75",
          },
          {
            label:
              "Acceptable exposure to force majeure risk. All risks relating to the project are accounted for",
            value: "50",
          },
          {
            label:
              "Significantly exposed to force majeure risk due to certain external factors (e.g. war, civil unrest)",
            value: "25",
          },
          {
            label:
              "Exposed to unacceptable force majeure risk due to certain external factors (e.g. war, civil unrest)",
            value: "0",
          },
        ],
      },
      {
        key: "environmentalAndSocialRisks",
        label: "Environmental and Social Risks",
        options: [
          {
            label:
              "Little to no Environmental or Social risks; firm has adopted equator principles",
            value: "100",
          },
          {
            label:
              "Moderate Environmental or Social risk. Adequate and time bound management plans being implemented to mitigate risks/impacts",
            value: "75",
          },
          {
            label:
              "Acceptable Environmental or Social risk; satisfactory management plans being implemented by capable team",
            value: "50",
          },
          {
            label:
              "Major Environmental or Social risk, some of which could be irreversible or unprecedented. Need for extreme care and stronger diligence",
            value: "25",
          },
          {
            label: "Very high exposure; no mitigation instruments",
            value: "0",
          },
        ],
      },
    ],
  },
  {
    title: "TRANSACTION CHARACTERISTICS",
    fields: [
      {
        key: "designAndTechnologyRisk",
        label: "Design and Technology Risk",
        options: [
          {
            label:
              "Well established and commercially proven process design & technology. Low risk of obsolescence",
            value: "100",
          },
          {
            label:
              "Established and less commercially proven process design & technology. Low risk of obsolescence",
            value: "75",
          },
          {
            label:
              "New technology and design — start-up issues may exist but mitigated by strong completion package. Moderate risk of obsolescence",
            value: "50",
          },
          {
            label:
              "New technology and design — start-up issues exist. Significant risk of obsolescence",
            value: "25",
          },
          {
            label: "Unproven technology and design. Technology issues exist",
            value: "0",
          },
        ],
      },
      {
        key: "typeOfConstructionContract",
        label: "Type of Construction Contract",
        options: [
          {
            label:
              'Fixed-price, date-certain turnkey construction EPC. "Certainty of cost" to the owner',
            value: "100",
          },
          {
            label:
              "Fixed-price, date-certain turnkey construction contract with many contractors",
            value: "75",
          },
          {
            label: "Time and material contract with one contractor",
            value: "50",
          },
          {
            label:
              "Partial or no fixed-price turnkey contract and/or interfacing issues with multiple contractors",
            value: "0",
          },
        ],
      },
      {
        key: "completionGuarantees",
        label: "Completion Guarantees",
        options: [
          {
            label:
              "Strong completion guarantee from sponsors or EPC contractors with excellent financial standing or substantial liquidated damages",
            value: "100",
          },
          {
            label:
              "Completion guarantee from sponsors or EPC contractors with good financial standing or adequate liquidated damages supported by financial substance",
            value: "75",
          },
          {
            label:
              "Completion guarantee from sponsors or EPC contractors with good financial standing but liquidated damages not fully supported by financial substance",
            value: "50",
          },
          {
            label:
              "Weak completion guarantees, or inadequate liquidated damages not supported by financial substance",
            value: "25",
          },
          { label: "No completion guarantees", value: "0" },
        ],
      },
      {
        key: "trackRecordOfContractor",
        label: "Track Record and Financial Strength of Contractor",
        options: [
          {
            label:
              "Strong track record in constructing similar projects and excellent financial strength",
            value: "100",
          },
          {
            label:
              "Good track record in constructing similar projects and good financial strength",
            value: "75",
          },
          {
            label:
              "Satisfactory track record in constructing similar projects and average financial strength",
            value: "50",
          },
          {
            label:
              "Weak track record in constructing similar projects and poor financial strength",
            value: "25",
          },
          {
            label: "No track record in constructing similar projects",
            value: "0",
          },
        ],
      },
      {
        key: "omContracts",
        label: "Scope and Nature of O&M Contracts",
        options: [
          {
            label:
              "Strong long-term O&M contract with contractual performance incentives/penalties, and/or O&M reserve accounts",
            value: "100",
          },
          {
            label:
              "Strong long-term O&M contract with O&M reserve accounts, but no contractual performance incentives/penalties",
            value: "75",
          },
          {
            label: "Long-term O&M contract, and/or O&M reserve accounts",
            value: "50",
          },
          { label: "Limited O&M contract or O&M reserve account", value: "25" },
          {
            label:
              "No O&M contract: risk of high operational cost overruns beyond mitigants",
            value: "0",
          },
        ],
      },
      {
        key: "operatorExpertise",
        label: "Operator's Expertise, Track Record, and Financial Strength",
        options: [
          {
            label:
              "Very strong operator's expertise or committed technical assistance of the sponsors on an ongoing basis",
            value: "100",
          },
          {
            label:
              "Strong operator's expertise; required expertise likely available over significant portion of project life",
            value: "75",
          },
          {
            label:
              "Acceptable operator's expertise; required expertise may not always be available",
            value: "50",
          },
          {
            label:
              "Limited/weak, or local operator who may lack required skills and may be dependent on local authorities",
            value: "25",
          },
          {
            label:
              "No operator expertise or decision on operator hasn't been made",
            value: "0",
          },
        ],
      },
      {
        key: "projectGovernance",
        label: "Project Governance",
        options: [
          {
            label:
              "Strong corporate governance. All stakeholders have clearly defined and well delineated roles. Internal control function is well in place and effective",
            value: "100",
          },
          {
            label:
              "Above average corporate governance. All stakeholders have clearly defined roles. Internal control function is well in place but comparatively less effective",
            value: "75",
          },
          {
            label:
              "Average corporate governance. Roles and responsibilities not well defined and delineated. Internal control function is not effective",
            value: "50",
          },
          {
            label:
              "Below average corporate governance. Roles and responsibilities poorly defined. Internal control function exists only on paper",
            value: "25",
          },
          {
            label:
              "Poor corporate governance. Roles and responsibilities not defined and delineated. Internal control function is almost non-existent",
            value: "0",
          },
        ],
      },
      {
        key: "offtakeAgreement",
        label: "Nature of Offtake Agreement and Offtaker Quality",
        options: [
          {
            label:
              "Excellent creditworthiness of off-taker (AA rated); strong termination clauses; tenor exceeds debt maturity by more than 2 years",
            value: "100",
          },
          {
            label:
              "Good creditworthiness of off-taker (A+ or A- rated); strong termination clauses; tenor exceeds debt maturity by 1 to 2 years",
            value: "75",
          },
          {
            label:
              "Acceptable financial standing (BBB+ to BBB-); normal termination clauses; tenor generally matches debt maturity",
            value: "50",
          },
          {
            label:
              "Weak off-taker (BB and below); weak termination clauses; tenor does not exceed debt maturity",
            value: "25",
          },
          {
            label:
              "No off-taker or off-take agreement OR no market for the product",
            value: "0",
          },
        ],
      },
      {
        key: "diversificationOfOfftakers",
        label: "Diversification of Offtakers",
        options: [
          {
            label:
              "Very High: Highly diversified pool. Exit of an offtaker not likely to have any impact on the project",
            value: "100",
          },
          { label: "High: Well diversified pool of offtakers", value: "75" },
          {
            label:
              "Moderate: Moderately diversified. While exit of an offtaker may negatively impact, alternatives exist",
            value: "50",
          },
          {
            label:
              "Low: Poorly diversified. Exit of an offtaker may negatively impact the project",
            value: "25",
          },
          {
            label:
              "Very low: Not diversified. Highly likely to be negatively impacted should any offtaker pull out or default",
            value: "0",
          },
        ],
      },
      {
        key: "priceVolumeAndTransportationRisks",
        label: "Price, Volume and Transportation Risk of Feed-stocks",
        options: [
          {
            label:
              "Long-term supply contract with excellent financial standing supplier or very high availability. Little or no FX risk exposure",
            value: "100",
          },
          {
            label:
              "Long-term supply contract with good financial standing supplier or high availability. Moderate FX risk, adequately hedged",
            value: "75",
          },
          {
            label:
              "Long-term supply contract with decent financial standing supplier or moderate availability. A degree of price risk may remain",
            value: "50",
          },
          {
            label:
              "Short-term supply contract or long-term with financially weak supplier. Significant FX risk, poorly hedged",
            value: "25",
          },
          {
            label:
              "No supply contract with any supplier. Price risk is always present",
            value: "0",
          },
        ],
      },
      {
        key: "reserveRisks",
        label: "Reserve Risks (Natural Resource Development)",
        options: [
          {
            label:
              "Independently audited, proven and developed reserves well more than requirements over lifetime (excess > 25%)",
            value: "100",
          },
          {
            label:
              "Proven reserves can supply the project adequately through maturity of debt (excess 10% - 25%)",
            value: "75",
          },
          {
            label:
              "Proven reserves may not supply project adequately through maturity of debt (excess < 10%)",
            value: "50",
          },
          {
            label:
              "Presence of reserves. However, level is unproven and may or may not supply project adequately",
            value: "25",
          },
          { label: "Uncertainty around presence of reserves", value: "0" },
          {
            label:
              "Not Applicable (for projects which do not need natural resources)",
            value: "100",
          },
        ],
      },
    ],
  },
  {
    title: "STRENGTH OF SPONSOR / SECURITY PACKAGE",
    fields: [
      {
        key: "sponsorTrackRecord",
        label:
          "Sponsor's Track Record, Financial Strength, and Sector Experience",
        options: [
          {
            label:
              "Strong sponsor with excellent track record and high financial standing. Always complies with covenants",
            value: "100",
          },
          {
            label:
              "Good sponsor with good track record and good financial standing. Complies with covenants for the most part",
            value: "75",
          },
          {
            label:
              "Adequate sponsor with adequate track record and satisfactory financial standing. Decent covenant compliance",
            value: "50",
          },
          {
            label:
              "Weak sponsor with no or questionable track record and/or financial weaknesses",
            value: "25",
          },
          { label: "No sponsor", value: "0" },
        ],
      },
      {
        key: "sponsorSupportAndIncentive",
        label: "Sponsor Support and Incentive to Inject Additional Cash",
        options: [
          {
            label:
              "Very Strong - Project is highly strategic for the sponsor (core business). Very high commitment to support in event of cash shortfalls",
            value: "100",
          },
          {
            label:
              "Strong - Project is strategic for the sponsor (core business - long-term strategy)",
            value: "75",
          },
          {
            label:
              "High commitment and willingness to support the project in event of cash shortfalls",
            value: "50",
          },
          {
            label:
              "Acceptable. Project is considered important for the sponsor. Fairly committed and willing to support",
            value: "25",
          },
          {
            label:
              "Weak - Project is not key to sponsor's long-term strategy or core business",
            value: "0",
          },
        ],
      },
      {
        key: "lenderControlOverCashFlows",
        label: "Lender's Control Over Cash Flows and Use of Proceeds",
        options: [
          {
            label:
              "Complete control over operating cash flows and use of proceeds. All project cash flows are ring-fenced",
            value: "100",
          },
          {
            label:
              "Significant control over operating cash flows and use of proceeds. Significant portion ring-fenced",
            value: "75",
          },
          {
            label:
              "Moderate control over most of the cash flow. Moderate portion ring-fenced",
            value: "50",
          },
          {
            label:
              "Control over some of the cash flow. A little portion of project cash flows are ring-fenced",
            value: "25",
          },
          {
            label:
              "Limited or no control over project cash flows. Cash flows are not ring-fenced",
            value: "0",
          },
        ],
      },
      {
        key: "strengthOfCovenantPackage",
        label: "Strength of Covenant Package",
        options: [
          {
            label:
              "Strong covenant package. Financial restriction and no additional debt without recourse to lender",
            value: "100",
          },
          {
            label:
              "Satisfactory covenant package. Extremely limited additional debt (up to 10% of existing loan)",
            value: "75",
          },
          {
            label:
              "Fair covenant package. Limited additional debt without recourse (10% - 25% of existing loan)",
            value: "50",
          },
          {
            label:
              "Weak covenant package. Limited additional debt without recourse (25% - 50% of existing loan)",
            value: "25",
          },
          {
            label:
              "Insufficient covenant package. Unlimited additional debt without recourse to lender",
            value: "0",
          },
        ],
      },
      {
        key: "reserveFunds",
        label: "Reserve Funds (Debt Service, O&M, Renewal and Replacement)",
        options: [
          {
            label:
              "All reserve funds fully funded prior to financial close in cash or letters of credit from highly rated bank",
            value: "100",
          },
          {
            label:
              "All reserve funds fully funded from use of proceeds in cash or letters of credit from highly rated bank",
            value: "75",
          },
          { label: "No reserve funds", value: "0" },
        ],
      },
      {
        key: "chargeOnAssets",
        label: "Charge on Assets",
        options: [
          {
            label:
              "First perfected security interest in all project assets, contracts, permits and accounts (e.g. First and Exclusive Charge)",
            value: "100",
          },
          {
            label:
              "Perfected security interest in all project assets (e.g. Pari-Passu for Consortium projects)",
            value: "75",
          },
          {
            label:
              "Acceptable security interest in all project assets (e.g. Subordinated Charge)",
            value: "50",
          },
          {
            label:
              "Little security or collateral for lenders; weak negative pledge clause",
            value: "25",
          },
          { label: "No security or collateral for lenders", value: "0" },
        ],
      },
    ],
  },
];

const CF_NON_FINANCIALS_SECTIONS = [
  {
    title: "MANAGEMENT",
    fields: [
      {
        key: "experienceOfManagement",
        label: "Experience of Management in the Industry",
        options: [
          {
            label: "(≥ 15 years). Highly Competent - Best Experience",
            value: "100",
          },
          { label: "(≥ 10 but < 15 years). Good Experience", value: "75" },
          {
            label: "(≥ 5 but < 10 years). Moderate level of Experience",
            value: "50",
          },
          { label: "(≥ 2 but < 5 years). Modest Experience", value: "25" },
          { label: "(< 2 years). Low Experience", value: "0" },
        ],
      },
      {
        key: "integrityCredentials",
        label: "Integrity, Credentials and Background of Management",
        options: [
          {
            label:
              "Management's character and integrity is faultless. No fraudulent transactions recorded including public lawsuits. Never blacklisted",
            value: "100",
          },
          {
            label:
              "Unsubstantiated accounts of dishonest or unethical events recorded. No blacklisting in last five years",
            value: "50",
          },
          {
            label:
              "Management is perceived to have highly questionable integrity and a very bad track record. Instances of suspect integrity is public knowledge",
            value: "0",
          },
        ],
      },
      {
        key: "corporateGovernment",
        label: "Corporate Governance",
        options: [
          {
            label:
              "Strong corporate governance principles. All relevant board committees with clearly defined responsibilities. Internal audit and controls functions are effective",
            value: "100",
          },
          {
            label:
              "Above average corporate governance principles. Relevant board committees with clearly defined responsibilities. Internal controls and audit functions exist but comparatively less effective",
            value: "75",
          },
          {
            label:
              "Good corporate governance principles with relevant board committees and responsibilities, but internal control and audit functions are not effective",
            value: "50",
          },
          {
            label:
              "Indication of some corporate governance principles with some committees; however, they are not regarded as effective",
            value: "25",
          },
          {
            label:
              "No evidence of management demonstrating good corporate governance principles",
            value: "0",
          },
        ],
      },
      {
        key: "pastPaymentRecord",
        label: "Past Payment Record and Track Record",
        options: [
          {
            label: "Exceptional payment record: Debt serviced on time",
            value: "100",
          },
          {
            label:
              "Decent payment record: Obligations delayed but settled within 30 days past due",
            value: "75",
          },
          {
            label:
              "Average payment record: Obligations delayed but settled between 30 days past due - 60 days past due",
            value: "50",
          },
          {
            label:
              "Poor payment record: Obligations delayed but settled between 60 days past due - 90 days past due",
            value: "25",
          },
          {
            label:
              "Extremely poor payment record: Classified as default in the past",
            value: "0",
          },
        ],
      },
      {
        key: "successionPlanning",
        label: "Succession Planning - Key Man Risk",
        options: [
          {
            label:
              "Succession policy for Chairman, MD/CEO, all executive and non-executive directors and senior management. Reviewed annually with emergency provisions",
            value: "100",
          },
          {
            label:
              "Succession policy for MD/CEO, all executive and non-executive directors and senior management. Reviewed every two years with emergency provisions",
            value: "75",
          },
          {
            label:
              "Succession policy only in place for management staff. Reviewed every three years with emergency provisions",
            value: "50",
          },
          {
            label:
              "Succession plan is not reviewed periodically and does not have provision for emergency situations",
            value: "25",
          },
          { label: "Absence of a succession policy or plan", value: "0" },
        ],
      },
    ],
  },
  {
    title: "BUSINESS",
    fields: [
      {
        key: "exposureToMarketRisk",
        label: "Exposure to Market Risk",
        options: [
          {
            label: "Low exposure to market risk or risks fully hedged",
            value: "100",
          },
          {
            label:
              "Moderate exposure to market risk (e.g. commodity price risk, FX risk) or risk is adequately hedged. Residual risk is within reasonable limits",
            value: "75",
          },
          {
            label:
              "Medium impact of market risks on the corporate. Risks are sometimes hedged. Residual risk is moderate",
            value: "50",
          },
          {
            label:
              "Medium to significant exposure to market risk. Risks are not hedged, but there are noticeable management controls. Residual risk is moderate to high",
            value: "25",
          },
          {
            label:
              "Significant exposure to market risk. High impact with no hedge or adequate management control. Residual risk is high",
            value: "0",
          },
        ],
      },
      {
        key: "marketShare",
        label: "Market Share",
        options: [
          {
            label:
              "Very high. Company has overwhelming portion of market share. No competition has a share close to the company",
            value: "100",
          },
          {
            label:
              "High. Company has considerable market share, but it is relatively not overwhelming",
            value: "75",
          },
          {
            label:
              "Moderate. Company has decent share of the market, but there are other companies with similar or higher share",
            value: "50",
          },
          {
            label:
              "Low. Company's share of the market is sizeable but very small compared to other firms. Many other companies dwarf theirs",
            value: "25",
          },
          {
            label:
              "Very low. Company's market share is negligible. Little or no other firm has a smaller market share",
            value: "0",
          },
        ],
      },
      {
        key: "accessToResources",
        label: "Access to Resources",
        options: [
          {
            label:
              "Raw materials / man power easily available & price is steady. Substitute inputs available locally or low risk in sourcing imports",
            value: "100",
          },
          {
            label:
              "Raw materials / man power generally available at steady price. Few alternate usages but supply is adequate",
            value: "75",
          },
          {
            label:
              "Availability ensured by tie-ups with suppliers evidenced by contracts. Price variations can be passed on to consumers",
            value: "50",
          },
          {
            label:
              "Industry highly dependent on critical raw materials. Timely availability is critical. Needs large stocking levels",
            value: "25",
          },
          {
            label:
              "Availability extremely seasonal. Extreme price fluctuations. Production loss has occurred due to scarcity",
            value: "0",
          },
        ],
      },
      {
        key: "financialFlexibility",
        label: "Financial Flexibility",
        options: [
          {
            label:
              "Exceptional and proven financial capabilities in accessing alternative sources of funds in crisis situations",
            value: "100",
          },
          {
            label:
              "Above average financial capabilities in accessing alternative sources of funds in crisis situations",
            value: "75",
          },
          {
            label:
              "Average financial capabilities in accessing alternative sources of funds in crisis situations",
            value: "50",
          },
          {
            label:
              "Below average financial capabilities in accessing alternative sources of funds in crisis situations",
            value: "25",
          },
          {
            label:
              "Inadequate financial capabilities; non-availability of internal or external sources of funds",
            value: "0",
          },
        ],
      },
    ],
  },
  {
    title: "INDUSTRY",
    fields: [
      {
        key: "regulatoryEnvironment",
        label: "Impact of Government Directives / Regulatory Policy",
        options: [
          {
            label:
              "More than one policy is highly favorable and unambiguous. Impact on industry trend and performance is insignificant or none",
            value: "100",
          },
          {
            label:
              "One policy is very favorable (e.g. protective import tariffs/incentives) positively impacting profitability. Very low impact on industry trend",
            value: "75",
          },
          {
            label:
              "Existing government policies are not significantly favorable/unfavorable. Profitability not particularly influenced by regulatory measures",
            value: "50",
          },
          {
            label:
              "Negative influence due to current government policies. No new policy expected in near term. High impact on industry trend and performance",
            value: "25",
          },
          {
            label:
              "Government policy has significantly negative influence or extremely unfavorable (e.g. high excise burden, unviable price regulation)",
            value: "0",
          },
        ],
      },
      {
        key: "competitionDynamics",
        label: "Extent of Competition",
        options: [
          {
            label:
              "Near-monopoly structure. Prospect of new entrants in medium term unlikely. No threat from imports",
            value: "100",
          },
          {
            label:
              "Few large players accounting for bulk of market share. Capital investment likely to discourage significant increase in competition",
            value: "75",
          },
          {
            label:
              "Fairly fragmented structure. Moderate entry barriers in technology/capital investment. Fair extent of value addition",
            value: "50",
          },
          {
            label:
              "Highly fragmented industry with scope for new players. Processes very easily replicable with large, cost-competitive unorganized sector",
            value: "25",
          },
          {
            label:
              "Extremely competitive with near absence of entry barriers. No player capable of building significant market share",
            value: "0",
          },
        ],
      },
      {
        key: "industryOutlook",
        label: "Industry Outlook",
        options: [
          {
            label:
              "Strongly Growing. Trend shows constant growth or increase over the last 5 years and expected to continue",
            value: "100",
          },
          {
            label:
              "Growing. Trend depicts increasing pattern over the last 3 years",
            value: "75",
          },
          {
            label: "Stable or Steady. Trend is stable and steady",
            value: "50",
          },
          { label: "Decline. Trend shows decline in recent past", value: "25" },
          {
            label:
              "Strong Decline. Trend shows heavy decrease or a declining trend",
            value: "0",
          },
        ],
      },
      {
        key: "marketSupplyDemand",
        label: "Demand-Supply Gap",
        options: [
          {
            label: "Acute - Demand exceeds supply to a great extent",
            value: "100",
          },
          { label: "High - Demand is more than supply", value: "75" },
          { label: "Moderate - Supply is in tune with Demand", value: "50" },
          { label: "Marginal - Supply exceeds demand marginally", value: "25" },
          {
            label: "Negative Gap - Supply exceeds demand to a large extent",
            value: "0",
          },
        ],
      },
      {
        key: "industryCyclicality",
        label: "Cyclical Nature of the Industry",
        options: [
          {
            label:
              "Demand for industry's output is not cyclical. Variation in demand is not due to changes in weather, time of year, etc.",
            value: "100",
          },
          {
            label:
              "Demand for industry's output is quite cyclical. Varies moderately depending on weather, time of year, etc.",
            value: "50",
          },
          {
            label:
              "Demand for industry's output is highly cyclical. Varies significantly depending on weather, time of year, etc.",
            value: "0",
          },
        ],
      },
    ],
  },
  {
    title: "RELIABILITY OF FINANCIAL STATEMENTS",
    fields: [
      {
        key: "reliabilityOfAuditors",
        label: "Reliability of Auditors",
        options: [
          {
            label:
              "Externally audited by a top 6 accounting firm (KPMG, PwC, Deloitte, EY, Grant Thornton & BDO) with no qualification",
            value: "100",
          },
          {
            label:
              "Externally audited by a reputable Non-top 6 Accounting firm with no qualification",
            value: "75",
          },
          { label: "Externally audited but qualified", value: "25" },
          { label: "Not externally audited", value: "0" },
        ],
      },
      {
        key: "timelinessOfFinancials",
        label: "Timeliness of Financial Statements",
        options: [
          {
            label:
              "Current; Most recent audited Financial Statement is less than one year old",
            value: "100",
          },
          {
            label:
              "Stale; Most recent audited Financial Statement is between 1-2 years old",
            value: "50",
          },
          {
            label:
              "Very stale; Most recent audited Financial Statement is more than 2 years old",
            value: "0",
          },
        ],
      },
      {
        key: "reliabilityOfProjections",
        label: "Reliability of Financial Projections",
        options: [
          {
            label:
              "Reliable; Key assumptions are verifiable, reasonable, observable, and unbiased",
            value: "100",
          },
          {
            label:
              "Fair; Key assumptions are verifiable, reasonable, observable; however, there are some elements of management bias",
            value: "50",
          },
          {
            label:
              "Unreliable; Key assumptions are unreasonable and have high degree of management bias",
            value: "0",
          },
        ],
      },
    ],
  },
];

export {
  STATUS_OPTIONS,
  PF_NON_FINANCIALS_SECTIONS,
  CF_NON_FINANCIALS_SECTIONS,
};
