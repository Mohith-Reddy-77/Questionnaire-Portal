// Marketing-site content shared across pages. Edit text, prices and links here.

export const CONTACT = {
  email: 'readyfutureskills@gmail.com',
  phone: '8121427231',
  location: 'Bengaluru, India',
};

// "Start Your Journey" / "Start Your Career Discovery" open this Google Form.
export const JOURNEY_FORM_URL = 'https://forms.gle/jJuZPJpWMoRr6UKq6';

// Partner With Us / Become a Mentor / Industry buttons open this Google Form.
export const PARTNER_FORM_URL = 'https://forms.gle/tccv47TgJPa9j1Bd8';

// Instagram accounts listed in the contact section (handle without the @).
export const INSTAGRAM_HANDLES = ['readyfutureskill', 'the.thi.tale'];

export type ContactRole = 'Parent' | 'Student' | 'Mentor' | 'Educational Institution';

// Prices and booking messages for each offering. `id` doubles as the page anchor.
export const OFFERINGS = {
  discovery: {
    id: 'career-discovery',
    title: 'Career Discovery Call',
    price: '₹499',
  },
  mentor: {
    id: 'mentor-call',
    title: 'Professional Mentor Call',
    price: '₹999',
  },
  roadmap: {
    id: 'roadmap-call',
    title: 'Educational Roadmap Call',
    price: '₹799',
  },
  program: {
    id: 'program',
    title: 'Personalised Career Discovery Program',
    price: '₹5,999',
  },
};

// PLACEHOLDER: names, roles and companies come from the design mock-up.
// Replace with your real mentors (and add `photo: '/mentors/name.jpg'`) before going live.
export const MENTORS: { name: string; role: string; experience: string; company: string; photo?: string }[] = [
  { name: 'Ananya Rao', role: 'Product Manager', experience: '8+ years', company: 'Google' },
  { name: 'Rehan Mehta', role: 'Software Engineer', experience: '10+ years', company: 'Amazon' },
  { name: 'Priya Iyer', role: 'Consultant', experience: '7+ years', company: 'Deloitte' },
  { name: 'Arjun Khanna', role: 'Brand Manager', experience: '9+ years', company: 'Nestlé' },
  { name: 'Sohana Nair', role: 'Research Associate', experience: '6+ years', company: 'IIT Bombay' },
  { name: 'Vikram Srinivasan', role: 'Data Scientist', experience: '6+ years', company: 'IIT Madras' },
  { name: 'Meera Kapoor', role: 'UX Designer', experience: '6+ years', company: 'Microsoft' },
  { name: 'Karan Malhotra', role: 'Marketing Manager', experience: '5+ years', company: 'Adobe' },
  { name: 'Nisha Varghese', role: 'Strategy Lead', experience: '12+ years', company: 'Goldman Sachs' },
  { name: 'Aditya Menon', role: 'Product Manager', experience: '7+ years', company: 'Swiggy' },
];

export type TestimonialGroup = 'Students' | 'Parents' | 'Teachers';

// PLACEHOLDER: quotes come from the design mock-up. Replace with real testimonials;
// add `videoUrl` (YouTube/Drive link) and `thumbnail` to show a playable video card.
export const TESTIMONIALS: {
  group: TestimonialGroup;
  quote: string;
  role: string;
  detail: string;
  videoUrl?: string;
  thumbnail?: string;
}[] = [
  { group: 'Students', quote: 'This program really helped me understand what I actually enjoy. I feel much more confident now.', role: 'Student', detail: 'Grade 10' },
  { group: 'Parents', quote: 'As a parent, I now feel more involved and informed about my child’s interests and options.', role: 'Parent', detail: 'Grade 9' },
  { group: 'Teachers', quote: 'READY brings real-world exposure to our students. It’s an invaluable experience for their future.', role: 'Teacher', detail: 'CBSE School' },
];

export const FAQS = [
  {
    q: 'Is READY a free or paid program?',
    a: 'READY offers paid career exploration and mentoring programs designed to provide students with structured guidance, real-world insights, and meaningful learning experiences. Our programs go beyond general information available online, helping students explore career possibilities and make more informed decisions about their future.',
  },
  {
    q: 'Why should I pay for this when my child can learn about careers online?',
    a: 'Online resources can explain what a career is, but they cannot always provide the personal guidance and first-hand perspectives students need. READY connects students with real professionals, industry insights, practical projects, and structured career exploration to help them understand what different careers are actually like.',
  },
  {
    q: 'My child is only in Grade 8. Isn’t it too early to think about careers?',
    a: 'Not at all! Grades 8–12 are an ideal time to explore interests, discover new possibilities, and understand different career paths before making important academic decisions. READY does not expect students to choose a career immediately. Instead, we help them explore their options at their own pace and build clarity over time.',
  },
  {
    q: 'What will my child actually gain from the program?',
    a: 'Students gain exposure to different careers, insights from working professionals, opportunities to explore through practical projects and experiences, and guidance on possible educational pathways. The goal is to help them understand their interests, ask better questions, and identify meaningful next steps towards their future.',
  },
  {
    q: 'How is READY different from other career counselling or guidance programs?',
    a: 'READY combines structured career exploration with real-world exposure and professional mentorship. Rather than relying only on assessments or recommendations, we help students learn about careers through conversations with professionals, practical experiences, and guided exploration. This helps them understand not just which careers exist, but what those careers involve in real life.',
  },
  {
    q: 'Can I, as a parent, be involved in my child’s journey?',
    a: 'Absolutely! Parents play an important role in helping children make informed career decisions. READY encourages parents to participate in the exploration journey, understand their child’s interests, and have more meaningful conversations about future possibilities. Parent feedback and involvement will depend on the program selected.',
  },
  {
    q: 'Are the programs conducted online or offline?',
    a: 'READY offers career exploration through guided mentoring conversations and real-world learning experiences. Depending on the program, sessions may take place online or involve offline experiences such as industry exposure and practical activities. The format and details will be shared before booking.',
  },
  {
    q: 'Will READY guarantee that my child chooses the right career?',
    a: 'No program can guarantee a perfect career choice, and we believe students should have the freedom to discover what works for them. READY helps students make more informed decisions by giving them access to reliable information, professional perspectives, and structured exploration. Our goal is to help every child move from career confusion to career clarity, one step at a time.',
  },
];

export const COMMUNITY_PHOTOS = [
  '/WhatsApp Image 2026-08-24 at 9.49.24 PM.jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.24 PM (1).jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.25 PM.jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.25 PM (1).jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.25 PM (2).jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.25 PM (3).jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.26 PM.jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.26 PM (1).jpeg',
  '/WhatsApp Image 2026-08-24 at 9.49.26 PM (2).jpeg',
];
