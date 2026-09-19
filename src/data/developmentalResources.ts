import { DevelopmentalResource } from '../types';

export const DEVELOPMENTAL_RESOURCES: DevelopmentalResource[] = [
  {
    id: 'early-intervention-directory',
    title: 'State & National Early Intervention (Part C IDEA)',
    organization: 'US Department of Education / CDC Early Childhood',
    description: 'Every US state and territory provides free or low-cost developmental evaluations and therapies (speech, physical, occupational) for children from birth to age 3, without requiring a doctor’s referral.',
    helpfulFor: 'If you or your pediatrician feel extra support would help your child reach their milestones.',
    externalUrl: 'https://www.cdc.gov/ncbddd/actearly/parents/states.html',
    type: 'Free Public Program',
  },
  {
    id: 'cdc-act-early',
    title: 'CDC "Learn the Signs. Act Early." Program',
    organization: 'Centers for Disease Control and Prevention (CDC)',
    description: 'Evidence-based developmental checklists, photo/video milestone libraries, and tips for speaking calmly and confidently with your child’s healthcare provider.',
    helpfulFor: 'Clear visual examples of what typical milestones look like in real babies and toddlers.',
    externalUrl: 'https://www.cdc.gov/ncbddd/actearly/index.html',
    type: 'Pediatric Guide',
  },
  {
    id: 'aap-healthychildren',
    title: 'HealthyChildren.org by the AAP',
    organization: 'American Academy of Pediatrics',
    description: 'Pediatrician-authored guidance covering emotional health, language growth, physical development, and what to expect during each well-child visit.',
    helpfulFor: 'Understanding what pediatricians check for during standard 6, 9, 12, 18, and 24-month well-child visits.',
    externalUrl: 'https://www.healthychildren.org',
    type: 'Pediatric Guide',
  },
  {
    id: 'zero-to-three',
    title: 'ZERO TO THREE Parenting Resources',
    organization: 'National Center for Infants, Toddlers, and Families',
    description: 'Research-grounded articles on playful learning, emotional regulation, brain development, and stress-free everyday routines for parents and babies.',
    helpfulFor: 'Nurturing connection, coping with tantrums, and understanding baby brain architecture through play.',
    externalUrl: 'https://www.zerotothree.org',
    type: 'Play & Development',
  },
  {
    id: 'parent-warmline',
    title: 'National Parent Helpline & Warmline',
    organization: 'Parents Anonymous / Family Support Services',
    description: 'Free, confidential, non-judgmental emotional support and guidance from compassionate trained advocates when you feel overwhelmed, exhausted, or anxious.',
    helpfulFor: 'Parent reassurance, self-care, and finding local family community support.',
    externalUrl: 'https://www.nationalparenthelpline.org',
    type: 'Support Hotline',
  },
];
