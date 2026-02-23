export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
}

export interface Material {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'Video' | 'Quiz';
  author: string;
}

export interface NavItem {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}
