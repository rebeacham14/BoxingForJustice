// Hand-authored 1:1 mirror of the literal text hardcoded in
// Frontend/src/pages/site/*.jsx as of the Phase 1 EditableText migration.
// Each key is a blockId in the form <pageSlug>.<sectionId>.<field>[.index]
// and must match the `id` prop passed to <EditableText> in that page's JSX -
// that's what makes a block resolve to real content instead of falling back
// to EditableText's `defaultValue`. Blocks whose value starts with
// "Owner to " are seeded as type 'placeholder' (same rendering as 'text',
// just a semantic marker) purely for future tooling.
function buildPage(slug, title, entries) {
  const sectionOrder = [];
  const sectionBlocks = new Map();

  for (const [blockId, value] of Object.entries(entries)) {
    const sectionId = blockId.split('.')[1];

    if (!sectionBlocks.has(sectionId)) {
      sectionOrder.push(sectionId);
      sectionBlocks.set(sectionId, []);
    }

    sectionBlocks.get(sectionId).push({
      blockId,
      type: /^Owner to /i.test(value) ? 'placeholder' : 'text',
      content: { value },
      style: {},
    });
  }

  return {
    slug,
    title,
    sections: sectionOrder.map((sectionId) => ({
      sectionId,
      layout: 'default',
      blocks: sectionBlocks.get(sectionId),
    })),
  };
}

const homeEntries = {
  'home.top.eyebrow': 'Justice begins before the fight',
  'home.top.title': 'Power is not taken.',
  'home.top.title-accent': 'It is restored.',
  'home.top.lede': 'We protect vulnerable people, prevent harm, and help youth, families, and survivors reclaim their power. Boxing is one tool. The mission is healing, justice, and lasting change.',
  'home.top.cta-primary': 'Refer a young person',
  'home.top.cta-secondary': 'Explore our work',
  'home.top.visual-kicker': 'Our youth-centered model',
  'home.top.three-cs.0.label': 'Choice',
  'home.top.three-cs.0.caption': 'My voice matters.',
  'home.top.three-cs.1.label': 'Control',
  'home.top.three-cs.1.caption': 'I can choose my response.',
  'home.top.three-cs.2.label': 'Confidence',
  'home.top.three-cs.2.caption': 'I am more than what happened.',
  'home.top.visual-statement': 'Not just winning fights.',
  'home.top.visual-statement-accent': 'Winning yourself back.',

  'home.why.eyebrow': 'Our purpose',
  'home.why.title': 'Trauma can steal choice, control, and confidence.',
  'home.why.title-accent': 'We help give them back.',
  'home.why.paragraph-1': 'Boxing For Justice works at the intersection of violence prevention, education, advocacy, emotional wellness, and community collaboration. We create safe pathways for people to build strength without being defined by what they have endured.',
  'home.why.paragraph-2': 'Justice means more than responding after harm occurs. It means recognizing warning signs, preventing abuse, restoring dignity, and equipping communities to protect their most vulnerable members.',

  'home.our-work.eyebrow': 'One mission. Multiple pathways.',
  'home.our-work.title-line1': 'Our work goes',
  'home.our-work.title-line2': 'beyond the ring.',
  'home.our-work.intro': 'We respond to connected challenges with a connected model—meeting people where they are and building practical routes toward safety, resilience, and leadership.',
  'home.our-work.focus.0.title': 'Prevention & Education',
  'home.our-work.focus.0.text': 'Practical education for youth, parents, caregivers, and community leaders on trafficking, grooming, abuse, bullying, substance misuse, and healthy boundaries.',
  'home.our-work.focus.1.title': 'Boxing & Life Skills',
  'home.our-work.focus.1.text': 'Beginning and Elite Boxing pathways help youth build fundamentals, fitness, discipline, resilience, and confidence—with a route to USA Boxing competition for athletes who are ready.',
  'home.our-work.focus.2.title': 'Community Partnership',
  'home.our-work.focus.2.text': 'Collaboration with nonprofits, educators, advocates, and service providers to close gaps and multiply impact across Riverside County.',

  'home.quote.text': 'We do not define young people by what they have endured. We help them discover the power they still hold.',
  'home.quote.attribution': 'Boxing For Justice',

  'home.method.eyebrow': 'Boxing as a tool',
  'home.method.title': 'We teach breathing before we teach punching.',
  'home.method.paragraph': 'The ring becomes a structured place to notice emotion, practice a pause, and choose what happens next. Participants learn that strength is not losing control—it is knowing how to regain it.',
  'home.method.check.0': 'Beginning Boxing welcomes youth at every experience level and builds strong fundamentals, fitness, and belonging.',
  'home.method.check.1': "Elite Boxing prepares committed youth for the demands of USA Boxing competition and develops the 4 D's.",
  'home.method.check.2': 'Every level values personal growth as much as athletic progress.',
  'home.method.cta': 'Find the right program',

  'home.impact.eyebrow': 'Built for measurable change',
  'home.impact.title': 'Credibility lives in',
  'home.impact.title-accent': 'what we can show.',
  'home.impact.lede': 'Our evaluation framework connects participation to meaningful changes in knowledge, behavior, resilience, and community reach. Program data and participant stories will make that progress visible.',
  'home.impact.measure.0': 'Participation and consistent engagement',
  'home.impact.measure.1': 'Growth in emotional regulation and confidence',
  'home.impact.measure.2': 'Knowledge gained through prevention education',
  'home.impact.measure.3': 'Referrals, collaborations, and community reach',
  'home.impact.funder-heading': 'For funders & community partners',
  'home.impact.funder-text': 'Our model is designed for transparent goals, responsible stewardship, coordinated referrals, and outcomes that can be communicated clearly.',

  'home.get-involved.eyebrow': 'Take the next step',
  'home.get-involved.title': 'Justice is a team effort.',
  'home.get-involved.title-accent': 'There is a place for you.',
  'home.get-involved.action.0.audience': 'For families',
  'home.get-involved.action.0.title': 'Enroll or refer a participant',
  'home.get-involved.action.1.audience': 'For organizations',
  'home.get-involved.action.1.title': 'Request education or training',
  'home.get-involved.action.2.audience': 'For community leaders',
  'home.get-involved.action.2.title': 'Become a partner',
  'home.get-involved.action.3.audience': 'For supporters',
  'home.get-involved.action.3.title': 'Volunteer or intern',
};

const aboutEntries = {
  'about.hero.eyebrow': 'About Boxing For Justice',
  'about.hero.title': 'Rooted in survival.',
  'about.hero.accent': 'Built for restoration.',
  'about.hero.lede': 'Boxing For Justice began with lived experience and a refusal to let silence have the final word. Today, that conviction powers a broader movement for safer youth, stronger families, and resilient communities.',

  'about.pillars.eyebrow': 'Our 3 pillars',
  'about.pillars.title-line1': 'What we',
  'about.pillars.title-line2': 'stand on.',
  'about.pillars.0.name': 'Healing-Centered Boxing',
  'about.pillars.0.description': 'Boxing as a structured tool for regulation, discipline, and confidence — not the end goal, the vehicle.',
  'about.pillars.1.name': 'Mentorship',
  'about.pillars.1.description': 'Consistent, trusted adults who walk alongside youth through decisions, setbacks, and growth.',
  'about.pillars.2.name': '— pillar 3 —',
  'about.pillars.2.description': 'Owner to name and describe the third pillar.',

  'about.story.fact-founded': 'Founded 2024',
  'about.story.fact-location': 'Riverside County, CA',
  'about.story.fact-status': '501(c)(3) public charity',
  'about.story.eyebrow': 'The story behind the mission',
  'about.story.title-line1': 'When pain becomes purpose,',
  'about.story.title-line2': 'silence loses its power.',
  'about.story.paragraph-1': 'Founder Martye Perkins is a survivor of exploitation, physical abuse, and sexual abuse. Her experience showed her how secrecy can protect harmful systems while isolating the very people who need support.',
  'about.story.paragraph-2': 'Walking alongside a young relative through the aftermath of severe abuse made the need even clearer: families require better tools, young people need safe adults, and behavior must be understood in the context of what a child may have survived.',
  'about.story.quote': 'My pain was not mine to carry in silence. It became the foundation of a purpose: creating spaces where young people are empowered, not overlooked, and where their voices are heard.',
  'about.story.quote-cite': 'Martye Perkins, Founder',

  'about.mission.label': 'Our mission',
  'about.mission.title': 'Protect. Educate. Restore.',
  'about.mission.text': 'We protect vulnerable people, prevent harm, and help youth, families, and survivors reclaim their power through education, advocacy, mentorship, community partnership, and healing-centered physical activity.',
  'about.vision.label': 'Our vision',
  'about.vision.title': 'Communities where power is shared.',
  'about.vision.text': 'We envision safer communities where youth are supported, survivors are treated with dignity, families can reach trusted resources, and every person knows their voice matters.',

  'about.values.eyebrow': 'How we show up',
  'about.values.title-line1': 'Values you can',
  'about.values.title-line2': 'feel in the room.',
  'about.values.0.name': 'Agency',
  'about.values.0.description': 'People deserve meaningful choices, respected boundaries, and a voice in what happens next.',
  'about.values.1.name': 'Dignity',
  'about.values.1.description': 'No one is reduced to a diagnosis, a circumstance, or the worst thing that happened to them.',
  'about.values.2.name': 'Safety',
  'about.values.2.description': 'Trust is built through consistency, appropriate boundaries, and environments designed for belonging.',
  'about.values.3.name': 'Accountability',
  'about.values.3.description': 'We set clear expectations, communicate honestly, and measure what our programs are meant to change.',
  'about.values.4.name': 'Collaboration',
  'about.values.4.description': 'We share the work, connect people to appropriate support, and value impact over recognition.',

  'about.funds.eyebrow': 'Where the money goes',
  'about.funds.title-line1': 'Funds,',
  'about.funds.title-line2': 'accounted for.',
  'about.funds.intro': 'A transparent look at how donations and program funding are put to work. Figures below are illustrative placeholders.',

  'about.sponsors.eyebrow': 'Sponsors',
  'about.sponsors.title-line1': 'Backed by',
  'about.sponsors.title-line2': 'our community.',

  'about.partners.eyebrow': 'Partners',
  'about.partners.title-line1': "We don't do",
  'about.partners.title-line2': 'this alone.',
  'about.partners.placeholder': 'Owner to add confirmed partner organizations here.',

  'about.staff.eyebrow': 'Leadership & staff',
  'about.staff.title-line1': 'People in',
  'about.staff.title-line2': 'your corner.',
  'about.staff.intro': 'Coaches, mentors, educators, and community leaders bring professional knowledge and lived experience to a mission grounded in responsibility.',
  'about.staff.0.name': 'Martye Perkins',
  'about.staff.0.role': 'Founder, Chief Executive Officer & Board Chair',
  'about.staff.1.name': 'Julian “JP” Powers',
  'about.staff.1.role': 'Director, Strength & Conditioning Coach & Board Vice Chair',
  'about.staff.2.name': 'Becky “Coach Bek” Perkins',
  'about.staff.2.role': 'Certified Amateur Boxing Coach & Board Secretary',
  'about.staff.3.name': 'Peter Phan',
  'about.staff.3.role': 'Marketing Director & Youth Mentor',
  'about.staff.4.name': 'Ryan “Ace” Beacham',
  'about.staff.4.role': 'Media & Production Director',
};

const advocacyEntries = {
  'advocacy.hero.eyebrow': 'Advocacy',
  'advocacy.hero.title': 'Speaking up.',
  'advocacy.hero.accent': 'Standing between.',
  'advocacy.hero.lede': "Boxing For Justice doesn't stop at the gym door. This is where we name the systems that fail kids and push for the ones that protect them.",

  'advocacy.awareness.eyebrow': '#AwarenessProtects',
  'advocacy.awareness.title-line1': 'Tap a block',
  'advocacy.awareness.title-line2': 'to learn more.',
  'advocacy.awareness.intro': 'Click or tap any block to flip it. Content below is a placeholder — the owner will fill in the real campaign details.',
  'advocacy.awareness.0.front': 'Block 1',
  'advocacy.awareness.0.back': 'Owner to add content.',
  'advocacy.awareness.1.front': 'Block 2',
  'advocacy.awareness.1.back': 'Owner to add content.',
  'advocacy.awareness.2.front': 'Block 3',
  'advocacy.awareness.2.back': 'Owner to add content.',

  'advocacy.legislative.eyebrow': 'Legislative prep',
  'advocacy.legislative.title-line1': 'Prepared to',
  'advocacy.legislative.title-line2': 'speak on policy.',
  'advocacy.legislative.placeholder': 'Owner to add content — committee/board recruitment, capital visits, and policy work will go here.',
  'advocacy.legislative.cta': 'Want to be on the BFJ committee/board?',
};

const ourWorkEntries = {
  'our-work.hero.eyebrow': 'What we do',
  'our-work.hero.title': 'One mission.',
  'our-work.hero.accent': 'Multiple pathways.',
  'our-work.hero.lede': 'Harm is connected. Healing must be, too. Our programs meet people at different points in their lives while advancing the same goal: safety, agency, resilience, and a future shaped by possibility.',

  'our-work.feature.tag': 'Boxing & life skills',
  'our-work.feature.title-line1': 'One program.',
  'our-work.feature.title-line2': 'Two youth pathways.',
  'our-work.feature.text': 'Beginning and Elite Boxing pathways build fitness, discipline, and confidence — with a route to USA Boxing competition for athletes who are ready. Full details now live on the enrollment portal.',
  'our-work.feature.cta': 'See the full breakdown',

  'our-work.campaigns.eyebrow': 'Campaigns',
  'our-work.campaigns.title-line1': '2028',
  'our-work.campaigns.title-line2': 'Olympics.',
  'our-work.campaigns.lede': "No past campaigns yet — this is the one we're building toward.",
  'our-work.campaigns.text': 'As the 2028 Olympics come to the region, BFJ is planning to partner with hotels, local businesses, and organizations to confront issues like prostitution and trafficking around USC and the surrounding areas during the Games.',

  'our-work.fundraisers.eyebrow': 'Fundraiser events',
  'our-work.fundraisers.title-line1': 'Coming',
  'our-work.fundraisers.title-line2': 'soon.',
  'our-work.fundraisers.placeholder': 'Owner to add upcoming fundraiser events.',

  'our-work.articles.eyebrow': 'Articles',
  'our-work.articles.title-line1': 'Coming',
  'our-work.articles.title-line2': 'soon.',
  'our-work.articles.placeholder': 'Owner to add articles and press.',

  'our-work.callout.title': 'Know the signs. Name the harm. Build safety.',
  'our-work.callout.subline': 'Owner to add subline.',

  'our-work.educating.eyebrow': 'Educating',
  'our-work.educating.title-line1': 'Know the signs.',
  'our-work.educating.title-line2': 'Name the harm.',
  'our-work.educating.title-line3': 'Build safety.',
  'our-work.educating.lede': 'Prevention begins when people have the language and confidence to recognize unsafe behavior, establish boundaries, and reach trusted help.',
  'our-work.educating.text': 'We educate youth, parents, guardians, kinship caregivers, schools, and community groups through clear, age-appropriate conversations about vulnerability, exploitation, abuse, and everyday pressures.',
  'our-work.educating.cta': 'Request a training',
  'our-work.educating.topic.0.detail': 'Owner to add detail.',
  'our-work.educating.topic.1.detail': 'Owner to add detail.',
  'our-work.educating.topic.2.detail': 'Owner to add detail.',
  'our-work.educating.topic.3.detail': 'Owner to add detail.',

  'our-work.equipping.eyebrow': 'Equipping',
  'our-work.equipping.title-line1': "Today's strength.",
  'our-work.equipping.title-line2': "Tomorrow's leaders.",
  'our-work.equipping.lede': 'Young people are more than the challenges they carry. We help them build skills that support healthy decisions, relationships, and goals.',
  'our-work.equipping.text': 'Mentorship, education, and structured activities help participants develop self-awareness, problem-solving, communication, perseverance, and community responsibility. Every success becomes evidence that a different future can be built.',
  'our-work.equipping.cta': 'Refer a young person',
  'our-work.equipping.0.front': 'Recognize',
  'our-work.equipping.0.back': 'emotions and warning signs',
  'our-work.equipping.1.front': 'Respond',
  'our-work.equipping.1.back': 'with skills instead of impulse',
  'our-work.equipping.2.front': 'Rise',
  'our-work.equipping.2.back': 'through leadership and purpose',

  'our-work.encouraging.eyebrow': 'Encouraging',
  'our-work.encouraging.title-line1': 'Community that',
  'our-work.encouraging.title-line2': 'shows up.',
  'our-work.encouraging.placeholder': 'Owner to add encouragement/mentorship stories and content.',

  'our-work.partnerships.eyebrow': 'Community partnership',
  'our-work.partnerships.title-line1': 'We do not compete',
  'our-work.partnerships.title-line2': 'for credit.',
  'our-work.partnerships.title-accent': 'We multiply impact.',
  'our-work.partnerships.text': 'Schools, nonprofits, advocates, clinicians, caregivers, and community leaders all hold part of the solution. Through outreach, education, referrals, shared resources, and coordinated efforts, we help people reach the right support while helping partner organizations advance their own missions.',
  'our-work.partnerships.cta': 'Build something together',
};

const impactEntries = {
  'impact.hero.eyebrow': 'Impact & accountability',
  'impact.hero.title': 'Measure what',
  'impact.hero.accent': 'matters.',
  'impact.hero.lede': 'Trust is earned through clear goals, responsible stewardship, honest learning, and evidence that programs are creating the changes they were designed to make.',

  'impact.policies.eyebrow': 'Policies',
  'impact.policies.title-line1': "What's on",
  'impact.policies.title-line2': 'the books.',
  'impact.policies.intro': 'A state-by-state look at the policies that shape how kids are protected. Content below is a placeholder — the owner will add real policy summaries.',
  'impact.policies.placeholder': 'Owner to add policy tracking content.',

  'impact.geo.eyebrow': 'GEO Data',
  'impact.geo.title-line1': 'Click a state.',
  'impact.geo.title-line2': 'See the picture.',
  'impact.geo.intro': 'Click or tap any state to see its policies and helpful data.',

  'impact.facts.0.value': '2024',
  'impact.facts.0.label': 'Year founded',
  'impact.facts.1.value': '8–21',
  'impact.facts.1.label': 'Youth & young adults served',
  'impact.facts.2.value': '501(c)(3)',
  'impact.facts.2.label': 'IRS-recognized public charity',
  'impact.facts.3.value': '99-3175496',
  'impact.facts.3.label': 'Employer identification number',

  'impact.change.eyebrow': 'Our path to change',
  'impact.change.title-line1': 'From a safe moment',
  'impact.change.title-line2': 'to a stronger future.',
  'impact.change.intro': 'Our model links every activity to an intended result. That keeps the work focused and gives funders, families, and partners a clear way to understand how change is expected to happen.',
  'impact.change.0.label': '01 / Begin',
  'impact.change.0.title': 'Create safety & access',
  'impact.change.0.text': 'Trusted adults, appropriate choices, clear expectations, and welcoming spaces make participation possible.',
  'impact.change.1.label': '02 / Practice',
  'impact.change.1.title': 'Build practical skills',
  'impact.change.1.text': 'Education, mentoring, movement, breathing, repetition, and reflection turn ideas into usable tools.',
  'impact.change.2.label': '03 / Strengthen',
  'impact.change.2.title': 'Reinforce agency',
  'impact.change.2.text': 'Participants experience progress, make decisions, recover from setbacks, and see their own capacity grow.',
  'impact.change.3.label': '04 / Lead',
  'impact.change.3.title': 'Carry change forward',
  'impact.change.3.text': 'Skills move beyond the program into school, relationships, work, family, service, and leadership.',

  'impact.outcomes.eyebrow': 'What we measure',
  'impact.outcomes.title-line1': 'Evidence with',
  'impact.outcomes.title-line2': 'integrity.',
  'impact.outcomes.intro': 'We are building a consistent evaluation practice that combines participation data, feedback, observed progress, and partner reach.',
  'impact.outcomes.0.title': 'Participation',
  'impact.outcomes.0.description': 'Consistent engagement, attendance, retention, and completion',
  'impact.outcomes.1.title': 'Personal growth',
  'impact.outcomes.1.description': 'Self-reported confidence, emotional awareness, and use of regulation skills',
  'impact.outcomes.2.title': 'Knowledge',
  'impact.outcomes.2.description': 'Understanding of boundaries, warning signs, safety, and help-seeking',
  'impact.outcomes.3.title': 'Progress',
  'impact.outcomes.3.description': 'Boxing or fitness development, goal completion, and demonstrated discipline',
  'impact.outcomes.4.title': 'Community reach',
  'impact.outcomes.4.description': 'Training participants, partner activity, referrals, and connections to support',

  'impact.integrity.eyebrow': 'Our commitment',
  'impact.integrity.title-line1': 'People are never',
  'impact.integrity.title-line2': 'marketing material.',
  'impact.integrity.paragraph-1': 'Participant stories can be powerful, but dignity comes first. We will seek appropriate permission, protect privacy, avoid sensationalizing trauma, and never inflate numbers to make the work appear larger than it is.',
  'impact.integrity.paragraph-2': 'As verified program data and approved participant stories are prepared, this site will publish them with context: what was measured, who was included, and what the results can—and cannot—tell us.',

  'impact.funder.seal-line1': 'Funder',
  'impact.funder.seal-line2': 'readiness',
  'impact.funder.eyebrow': 'For grantmakers & sponsors',
  'impact.funder.title-line1': 'A mission built',
  'impact.funder.title-line2': 'for partnership.',
  'impact.funder.text': 'Boxing For Justice is an IRS-recognized 501(c)(3) public charity. We welcome conversations about aligned funding, program sponsorship, in-kind support, collaborative proposals, and responsible capacity building.',
  'impact.funder.link-guidestar': 'View GuideStar profile',
  'impact.funder.link-partnership': 'Discuss a partnership',
};

const getInvolvedEntries = {
  'get-involved.hero.eyebrow': 'Get involved',
  'get-involved.hero.title': 'Justice is',
  'get-involved.hero.accent': 'a team effort.',
  'get-involved.hero.lede': 'Whether you need support, want to strengthen your community, or are ready to invest in the mission, there is a clear place to begin.',

  'get-involved.urgent.eyebrow': 'Immediate support',
  'get-involved.urgent.title': 'If someone may be in danger',
  'get-involved.urgent.text': 'Boxing For Justice is not an emergency service or crisis hotline.',
  'get-involved.urgent.0.label': 'Immediate danger',
  'get-involved.urgent.0.detail': 'Call 911',
  'get-involved.urgent.1.label': 'Human trafficking support',
  'get-involved.urgent.1.detail': 'Call 1-888-373-7888 · Text 233733',
  'get-involved.urgent.2.label': 'Mental health crisis support',
  'get-involved.urgent.2.detail': 'Call or text 988',

  'get-involved.contact.eyebrow': 'Not sure where to begin?',
  'get-involved.contact.title-line1': 'Tell us what',
  'get-involved.contact.title-line2': 'brings you here.',
  'get-involved.contact.text': 'Send a brief note and we will help route your question to the right person. Please do not include confidential details about abuse, exploitation, health, or a minor in your initial email.',
  'get-involved.contact.cta': 'Email Boxing For Justice',

  'get-involved.action.0.audience': 'Anyone with information to share',
  'get-involved.action.0.title': 'Make a report',
  'get-involved.action.0.text': 'Share a concern confidentially. If someone is in immediate danger, use the resources below instead.',
  'get-involved.action.0.label': 'Make a report',
  'get-involved.action.1.audience': 'Schools, nonprofits & community groups',
  'get-involved.action.1.title': 'Request education or training',
  'get-involved.action.1.text': 'Bring prevention education to your community around trafficking, exploitation, misconduct, abuse, bullying, peer pressure, substance misuse, boundaries, or help-seeking.',
  'get-involved.action.1.label': 'Request a training',
  'get-involved.action.2.audience': 'Other nonprofits, funders & community leaders',
  'get-involved.action.2.title': 'Build a community partnership',
  'get-involved.action.2.text': 'Partnerships are for organizations, not individuals — explore coordinated referrals, shared outreach, program sponsorship, collaborative grants, or a joint initiative that advances both missions.',
  'get-involved.action.2.label': 'Discuss partnership',
  'get-involved.action.3.audience': 'Individuals ready to serve',
  'get-involved.action.3.title': 'Join the committee or board',
  'get-involved.action.3.text': "Help shape the direction of BFJ's advocacy and programs as a committee or board member.",
  'get-involved.action.3.label': 'Ask about the board',
  'get-involved.action.4.audience': 'Families, caregivers & referral partners',
  'get-involved.action.4.title': 'Enroll or refer a participant',
  'get-involved.action.4.text': 'Ask about youth programming, mentorship, Beginning Boxing, or Elite Boxing. We will help identify the most appropriate next conversation.',
  'get-involved.action.4.label': 'Enroll in boxing',
  'get-involved.action.5.audience': 'Coaches, partners & community leaders',
  'get-involved.action.5.title': 'Offer an endorsement',
  'get-involved.action.5.text': 'Owner to add endorsement details.',
  'get-involved.action.5.label': 'Offer an endorsement',
  'get-involved.action.6.audience': 'Supporters & volunteers',
  'get-involved.action.6.title': 'Sign up for a fundraiser',
  'get-involved.action.6.text': 'Owner to add upcoming fundraiser sign-up details.',
  'get-involved.action.6.label': 'Sign up',
  'get-involved.action.7.audience': 'Students & early-career professionals',
  'get-involved.action.7.title': 'Explore internships',
  'get-involved.action.7.text': 'Tell us about the skills you hope to share — from events and outreach to mentoring, education, media, and administration.',
  'get-involved.action.7.label': 'Explore internships',
};

const enrollEntries = {
  'enroll.hero.eyebrow': 'Enroll a participant',
  'enroll.hero.title': 'Ready to',
  'enroll.hero.accent': 'get started?',
  'enroll.hero.lede': 'Registration, event info, and payment all live on our enrollment portal. Create an account there to enroll a participant, buy tickets, and manage your orders.',

  'enroll.how.eyebrow': 'How it works',
  'enroll.how.title-line1': 'One portal.',
  'enroll.how.title-line2': 'Everything you need.',
  'enroll.how.intro': 'The enrollment portal keeps a signed-in account, so you can come back anytime to check on an enrollment or order.',
  'enroll.how.0.title': 'Create an account',
  'enroll.how.0.text': 'Sign in or sign up on the enrollment portal to get started.',
  'enroll.how.1.title': 'Enroll or buy tickets',
  'enroll.how.1.text': 'Enroll a participant in a program, or purchase event tickets.',

  'enroll.portal.eyebrow': 'Go to the portal',
  'enroll.portal.title-line1': 'Enrollment',
  'enroll.portal.title-line2': 'portal.',
  'enroll.portal.text': "You'll leave this page and land on the enrollment portal, where you can sign in and get started.",
  'enroll.portal.cta': 'Go to the enrollment portal',
};

module.exports = [
  buildPage('home', 'Home', homeEntries),
  buildPage('about', 'About', aboutEntries),
  buildPage('advocacy', 'Advocacy', advocacyEntries),
  buildPage('our-work', 'Our Work', ourWorkEntries),
  buildPage('impact', 'Impact', impactEntries),
  buildPage('get-involved', 'Get Involved', getInvolvedEntries),
  buildPage('enroll', 'Enroll Participant', enrollEntries),
];
