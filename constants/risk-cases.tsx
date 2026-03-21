const FACILITY_TYPES = [
  "All Facility Types",
  "Mixed",
  "Term Loan",
  "Overdraft",
  "Revolving Credit",
];

const STATUS_OPTIONS = [
  "All Status",
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
      { key: "marketConditions", label: "Market Conditions" },
      {
        key: "abilityToMeetObligations",
        label: "Ability to Meet Obligations Under Stressed Scenarios",
      },
      {
        key: "predictabilityOfNetCashflow",
        label: "Predictability of Net Cashflow",
      },
      { key: "ppaStrength", label: "PPA Strength" },
      {
        key: "durationOfCreditVsProject1",
        label: "Duration of Credit Compare to Duration of Project",
      },
      { key: "amortisationSchedule1", label: "Amortisation Schedule" },
      {
        key: "durationOfCreditVsProject2",
        label: "Duration of Credit Compare to Duration of Project",
      },
      { key: "amortisationSchedule2", label: "Amortisation Schedule" },
      { key: "subordinatedDebt", label: "Subordinated Debt" },
    ],
  },
  {
    title: "POLITICAL AND REGULATORY FACTORS",
    fields: [
      { key: "politicalRisk", label: "Political Risk" },
      {
        key: "stabilityOfLegalAndRegulatoryEnvironment",
        label: "Stability of Legal and Regulatory Environment",
      },
      {
        key: "enforceabilityOfContracts",
        label: "Enforceability of Contracts, Collateral, and Security",
      },
      { key: "locationSpecificExposure", label: "Location Specific Exposure" },
      { key: "communityRelations", label: "Community Relations" },
      {
        key: "environmentalAndNaturalHazards",
        label: "Environmental and Natural Hazards",
      },
      {
        key: "acquisitionOfApprovals1",
        label: "Acquisition of All Necessary Approvals",
      },
      {
        key: "grantTimingAndFinancialReadiness1",
        label: "Grant Timing and Financial Readiness",
      },
      {
        key: "acquisitionOfApprovals2",
        label: "Acquisition of All Necessary Approvals",
      },
      {
        key: "grantTimingAndFinancialReadiness2",
        label: "Grant Timing and Financial Readiness",
      },
      { key: "milestoneForDisbursement", label: "Milestone for Disbursement" },
    ],
  },
  {
    title: "GENERAL CONSTRUCTION/INSTALLATION RISK",
    fields: [
      { key: "designAndTechnologyRisk", label: "Design and Technology Risk" },
      {
        key: "siteAccessibilityAndInfrastructure",
        label: "Site Accessibility and Infrastructure",
      },
      {
        key: "userInterfaceAndTrainingRequirements",
        label: "User Interface and Training Requirements",
      },
      { key: "epcQualityAssessment", label: "EPC Quality Assessment" },
      { key: "performanceGuarantees", label: "Performance Guarantees" },
      {
        key: "priceVolumeAndTransportationRisks",
        label: "Price, Volume, and Transportation Risks",
      },
      {
        key: "supplierTrackRecordAndFinancialStrength",
        label: "Supplier's Track Record and Financial Strength",
      },
      { key: "easeOfAssetRelocation", label: "Ease of Asset Relocation" },
      { key: "assetValueRetention", label: "Asset Value Retention" },
      { key: "marketDemand", label: "Market Demand" },
    ],
  },
  {
    title: "STRENGTH OF SPONSOR",
    fields: [
      {
        key: "sponsorTrackRecord",
        label:
          "Sponsor's Track Record, Financial Strength, and Sector Experience",
      },
      {
        key: "sponsorSupportAndIncentive",
        label:
          "Sponsor Support and Incentive to Inject Additional Cash if Needed",
      },
      {
        key: "legalStructureAndRiskFencing",
        label: "Legal Structure and Risk Fencing",
      },
      { key: "financialIndependence", label: "Financial Independence" },
      { key: "governanceAndManagement", label: "Governance and Management" },
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
      },
      {
        key: "integrityCredentials",
        label: "Integrity Credentials, and Background of Management",
      },
      { key: "corporateGovernment", label: "Corporate Government" },
      {
        key: "pastPaymentRecord",
        label: "Past Payment Record and Past Record",
      },
      { key: "successionPlanning", label: "Succession Planning" },
      { key: "riskManagementFramework", label: "Risk Management Framework" },
      { key: "localImplementation", label: "Local Implementation Capacity" },
    ],
  },
  {
    title: "BUSINESS",
    fields: [
      { key: "exposureToMarketRisk", label: "Exposure to Market Risk" },
      { key: "marketShare", label: "Market Share" },
      { key: "accessToResources", label: "Access to Resources" },
      { key: "financialFlexibility", label: "Financial Flexibility" },
    ],
  },
  {
    title: "INDUSTRY",
    fields: [
      { key: "regulatoryEnvironment", label: "Regulatory Environment" },
      { key: "competitionDynamics", label: "Competition Dynamics" },
      { key: "industryOutlook", label: "Industry Outlook" },
      { key: "marketSupplyDemand", label: "Market Supply/Demand Balance" },
      { key: "industryCyclicality", label: "Industry Cyclicality" },
    ],
  },
  {
    title: "RELIABILITY OF FINANCIAL STATEMENTS",
    fields: [
      { key: "reliabilityOfAuditors", label: "Reliability of Auditors" },
      {
        key: "timelinessOfFinancials",
        label: "Timeliness of Financial Statements",
      },
      {
        key: "reliabilityOfProjections",
        label: "Reliability of Financial Projections",
      },
    ],
  },
];

export {
  STATUS_OPTIONS,
  FACILITY_TYPES,
  PF_NON_FINANCIALS_SECTIONS,
  CF_NON_FINANCIALS_SECTIONS,
};
