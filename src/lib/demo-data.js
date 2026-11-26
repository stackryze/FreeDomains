export const IS_LOCAL_DEMO =
  import.meta.env.DEV && import.meta.env.VITE_DEMO_DASHBOARD === "true";

const daysFromNow = (days) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_USER = {
  _id: "demo-user-01",
  name: "Sudheer Developer",
  username: "sudheer-dev",
  email: "developer@stackryze.com",
  avatarUrl: "/stackryze_logo_white.png",
  isEmailVerified: true,
  githubVerified: true,
  whoisPrivacy: true,
  location: "Hyderabad, India",
  company: "Stackryze",
  blog: "https://stackryze.com",
  domainLimit: 2,
  sryzeDomainsLimit: 1,
  ryzeDnsDomainsLimit: 1,
  nxKgDomainsLimit: 1,
  ryznProDomainsLimit: 1,
  createdAt: daysAgo(180),
};

export const DEMO_SUBDOMAINS = [
  {
    _id: "demo-dom-1",
    name: "stackryze-api",
    domain: "indevs.in",
    status: "Active",
    recordType: "NS",
    recordValue: "ns1.stackryze.com, ns2.stackryze.com, ns3.stackryze.com",
    ownershipVerified: true,
    createdAt: daysAgo(125),
    expiresAt: daysFromNow(240),
  },
  {
    _id: "demo-dom-2",
    name: "docs",
    domain: "sryze.cc",
    status: "Active",
    recordType: "NS",
    recordValue: "ns1.external-dns.example, ns2.external-dns.example",
    ownershipVerified: false,
    createdAt: daysAgo(347),
    expiresAt: daysFromNow(18),
  },
  {
    _id: "demo-dom-3",
    name: "homelab",
    domain: "ryzedns.org",
    status: "Active",
    recordType: "NS",
    recordValue: "ns1.stackryze.com, ns2.stackryze.com, ns3.stackryze.com",
    ownershipVerified: false,
    dnsVerificationCode: "sryze-verify-9821-demo-token",
    createdAt: daysAgo(55),
    expiresAt: daysFromNow(310),
  },
  {
    _id: "demo-dom-4",
    name: "go",
    domain: "nx.kg",
    status: "Pending DNS",
    recordType: "NS",
    recordValue: "ns1.stackryze.com, ns2.stackryze.com",
    ownershipVerified: false,
    createdAt: daysAgo(2),
    expiresAt: daysFromNow(363),
  },
  {
    _id: "demo-dom-5",
    name: "legacy",
    domain: "indevs.in",
    status: "Expired",
    recordType: "NS",
    recordValue: "ns1.stackryze.com, ns2.stackryze.com",
    ownershipVerified: false,
    createdAt: daysAgo(369),
    expiresAt: daysAgo(4),
  },
];

export const DEMO_ACTIVITIES = [
  {
    _id: "act-1",
    type: "registration",
    description: "Registered subdomain go.nx.kg",
    timestamp: daysAgo(2),
  },
  {
    _id: "act-2",
    type: "nameserver_update",
    description: "Updated nameservers for docs.sryze.cc",
    changes: {
      before: "ns1.stackryze.com, ns2.stackryze.com",
      after: "ns1.external-dns.example, ns2.external-dns.example",
    },
    timestamp: daysAgo(12),
  },
  {
    _id: "act-3",
    type: "renewal",
    description: "Renewed stackryze-api.indevs.in for 1 year",
    timestamp: daysAgo(28),
  },
  {
    _id: "act-4",
    type: "login",
    description: "Signed in via Stackryze SSO",
    timestamp: daysAgo(1),
  },
  {
    _id: "act-5",
    type: "account_created",
    description: "Verified GitHub identity and activated registry quotas",
    timestamp: daysAgo(180),
  },
];
