export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialisation: string;
  years: number;
  availability: string;
  availableToday: boolean;
  initials: string;
  color: string;
}

export const DOCTORS: Doctor[] = [
  { id: "doc-1", name: "Dr. Adaeze Obi", title: "Endocrinologist", specialisation: "Endocrinology", years: 14, availability: "Available Today", availableToday: true, initials: "AO", color: "bg-teal" },
  { id: "doc-2", name: "Dr. Femi Adeyinka", title: "Internal Medicine", specialisation: "Internal Medicine", years: 9, availability: "Next Available: Thursday", availableToday: false, initials: "FA", color: "bg-navy" },
  { id: "doc-3", name: "Dr. Kemi Fashola", title: "Diabetologist", specialisation: "Diabetology", years: 11, availability: "Available Today", availableToday: true, initials: "KF", color: "bg-teal-light" },
  { id: "doc-4", name: "Dr. Chidi Nwachukwu", title: "General Practitioner", specialisation: "General Practice", years: 6, availability: "Available Today", availableToday: true, initials: "CN", color: "bg-coral" },
  { id: "doc-5", name: "Dr. Halima Musa", title: "Metabolic Health Specialist", specialisation: "Metabolic Health", years: 16, availability: "Next Available: Friday", availableToday: false, initials: "HM", color: "bg-navy-light" },
  { id: "doc-6", name: "Dr. Tunde Olatunji", title: "Cardiologist", specialisation: "Cardiology", years: 20, availability: "Next Available: Wednesday", availableToday: false, initials: "TO", color: "bg-risk-moderate" },
];
