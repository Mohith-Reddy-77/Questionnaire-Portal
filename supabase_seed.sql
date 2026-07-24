-- ========================================================
-- READY QUESTIONNAIRE PORTAL - SUPABASE SEED SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/josgifmpdkqgftdizyqt/sql/new
-- ========================================================

-- 1. Create Tables
create table if not exists settings (
  id text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists questions (
  id text primary key,
  payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists careers (
  id text primary key,
  payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists fasttrack_submissions (
  id text primary key,
  payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for fasttrack_submissions
alter table fasttrack_submissions enable row level security;
create policy "Allow fasttrack_submissions" on fasttrack_submissions for all using (true);

create policy "Allow settings" on settings for all using (true);
create policy "Allow questions" on questions for all using (true);
create policy "Allow careers" on careers for all using (true);
create policy "Allow submissions" on submissions for all using (true);

-- 2. Insert Admin Password Setting
insert into settings (id, value)
values ('admin_password', '1234')
on conflict (id) do update set value = excluded.value;

-- 3. Insert Diagnostic Questions (JSONB Payload)
insert into questions (id, payload) values
('q1', '{"id":"q1","category":"Favorite Activities","question":"Which of these activities sounds most fun to you?","subtitle":"Choose what you enjoy doing the most.","options":[{"id":"q1-a","label":"Building things, tinkering with gadgets, or solving math puzzles.","dimensionWeights":{"analytical":4,"technical":5,"research":1,"creative":0,"leadership":0,"communication":0}},{"id":"q1-b","label":"Helping sick people, caring for animals, or studying nature.","dimensionWeights":{"analytical":2,"technical":0,"research":5,"creative":0,"leadership":0,"communication":1}},{"id":"q1-c","label":"Speaking in front of people, reading books, or writing stories.","dimensionWeights":{"analytical":0,"technical":0,"research":1,"creative":1,"leadership":4,"communication":5}},{"id":"q1-d","label":"Drawing pictures, painting, or designing creative art.","dimensionWeights":{"analytical":0,"technical":1,"research":0,"creative":5,"leadership":0,"communication":2}}]}'::jsonb),

('q2', '{"id":"q2","category":"School Subjects","question":"Which subject in school do you enjoy the most?","subtitle":"Think about your favorite class.","options":[{"id":"q2-a","label":"Mathematics and Computer Science.","dimensionWeights":{"analytical":5,"technical":4,"research":1,"creative":0,"leadership":0,"communication":0}},{"id":"q2-b","label":"Biology and Science experiments.","dimensionWeights":{"analytical":2,"technical":1,"research":5,"creative":0,"leadership":0,"communication":0}},{"id":"q2-c","label":"English, History, and Social Studies.","dimensionWeights":{"analytical":0,"technical":0,"research":2,"creative":1,"leadership":3,"communication":5}},{"id":"q2-d","label":"Art, Craft, and Design.","dimensionWeights":{"analytical":0,"technical":0,"research":0,"creative":5,"leadership":1,"communication":2}}]}'::jsonb),

('q3', '{"id":"q3","category":"Teamwork","question":"When working on a school project with friends, what role do you like to take?","subtitle":"How do you help out best in a group?","options":[{"id":"q3-a","label":"Building the project model or figuring out how it works.","dimensionWeights":{"analytical":3,"technical":5,"research":1,"creative":0,"leadership":1,"communication":0}},{"id":"q3-b","label":"Finding facts, reading books, and gathering information.","dimensionWeights":{"analytical":3,"technical":0,"research":5,"creative":0,"leadership":0,"communication":1}},{"id":"q3-c","label":"Leading the team and presenting our project to the class.","dimensionWeights":{"analytical":1,"technical":0,"research":0,"creative":1,"leadership":5,"communication":4}},{"id":"q3-d","label":"Making colorful posters, slides, and decorating our project.","dimensionWeights":{"analytical":0,"technical":0,"research":0,"creative":5,"leadership":1,"communication":3}}]}'::jsonb),

('q4', '{"id":"q4","category":"Dream Field Trip","question":"If your school goes on a field trip, where would you choose to go?","subtitle":"Pick your dream destination.","options":[{"id":"q4-a","label":"A High-Tech Robotics & Space Center.","dimensionWeights":{"analytical":3,"technical":5,"research":2,"creative":0,"leadership":0,"communication":0}},{"id":"q4-b","label":"A Science Research Lab or Wildlife Sanctuary.","dimensionWeights":{"analytical":2,"technical":0,"research":5,"creative":0,"leadership":0,"communication":1}},{"id":"q4-c","label":"The Supreme Court or a News TV Studio.","dimensionWeights":{"analytical":1,"technical":0,"research":1,"creative":0,"leadership":5,"communication":5}},{"id":"q4-d","label":"A Famous Art Museum & Design Exhibition.","dimensionWeights":{"analytical":0,"technical":0,"research":0,"creative":5,"leadership":0,"communication":2}}]}'::jsonb),

('q5', '{"id":"q5","category":"Solving Problems","question":"When faced with a difficult problem, how do you handle it?","subtitle":"Choose your problem solving style.","options":[{"id":"q5-a","label":"Break it down step-by-step using logic and testing.","dimensionWeights":{"analytical":5,"technical":4,"research":1,"creative":0,"leadership":0,"communication":0}},{"id":"q5-b","label":"Search for clues, ask questions, and research the answer.","dimensionWeights":{"analytical":2,"technical":0,"research":5,"creative":0,"leadership":0,"communication":1}},{"id":"q5-c","label":"Talk to others, discuss ideas, and organize a solution together.","dimensionWeights":{"analytical":1,"technical":0,"research":0,"creative":0,"leadership":4,"communication":5}},{"id":"q5-d","label":"Think out of the box and try a new creative approach.","dimensionWeights":{"analytical":0,"technical":1,"research":0,"creative":5,"leadership":1,"communication":1}}]}'::jsonb)
on conflict (id) do update set payload = excluded.payload;

-- 4. Insert Career Professions Options (JSONB Payload)
insert into careers (id, payload) values
('career-engineer', '{"id":"career-engineer","title":"Engineer","category":"Engineering & Technology","badge":"Popular Choice","description":"Design and build futuristic technology, smart machines, bridges, software, and robotics.","requiredSkills":["Problem Solving","Mathematics","Coding & Logic","Tinkering"],"primaryDimension":"technical","accentColor":"#f97316"}'::jsonb),

('career-doctor', '{"id":"career-doctor","title":"Doctor","category":"Healthcare & Medicine","badge":"Essential Role","description":"Treat patients, diagnose health conditions, cure diseases, and save human lives.","requiredSkills":["Biology & Anatomy","Empathy","Critical Thinking","Caregiving"],"primaryDimension":"research","accentColor":"#10b981"}'::jsonb),

('career-lawyer', '{"id":"career-lawyer","title":"Lawyer","category":"Law & Public Policy","badge":"Leadership Role","description":"Defend justice, argue cases, protect rights, and advise people on laws and ethics.","requiredSkills":["Public Speaking","Logical Argumentation","Reading & Writing","Ethics"],"primaryDimension":"communication","accentColor":"#8b5cf6"}'::jsonb),

('career-scientist', '{"id":"career-scientist","title":"Scientist","category":"Science & Discovery","badge":"Research Choice","description":"Conduct experiments, discover new scientific truths, study space & nature, and innovate.","requiredSkills":["Curiosity","Observation","Data Analysis","Research"],"primaryDimension":"research","accentColor":"#3b82f6"}'::jsonb),

('career-teacher', '{"id":"career-teacher","title":"Teacher","category":"Education & Mentorship","badge":"Noble Profession","description":"Guide young minds, teach exciting school subjects, inspire students, and shape the future.","requiredSkills":["Patience","Communication","Subject Mastery","Leadership"],"primaryDimension":"leadership","accentColor":"#f59e0b"}'::jsonb),

('career-artist', '{"id":"career-artist","title":"Artist & Designer","category":"Creative & Visual Arts","badge":"Creative Choice","description":"Express ideas through painting, digital illustrations, graphic design, animation, and craft.","requiredSkills":["Drawing & Sketching","Color Theory","Digital Arts","Imagination"],"primaryDimension":"creative","accentColor":"#e11d48"}'::jsonb),

('career-architect', '{"id":"career-architect","title":"Architect","category":"Architecture & Design","badge":"Builder Choice","description":"Design beautiful buildings, eco-friendly homes, modern bridges, and smart city spaces.","requiredSkills":["3D Design","Geometry & Math","Creativity","Spatial Thinking"],"primaryDimension":"analytical","accentColor":"#6366f1"}'::jsonb),

('career-astronaut', '{"id":"career-astronaut","title":"Astronaut","category":"Space & Exploration","badge":"Inspiring Choice","description":"Travel into outer space, pilot space stations, study stars and planets, and explore the universe.","requiredSkills":["Physics & Math","Physical Fitness","Problem Solving","Teamwork"],"primaryDimension":"technical","accentColor":"#06b6d4"}'::jsonb)
on conflict (id) do update set payload = excluded.payload;
