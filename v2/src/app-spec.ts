import type { UpdateComponentsMessage } from './a2ui/types.js';
import type { ColSpec, TableOptions } from './components/data-table.js';

export const appSpec: UpdateComponentsMessage = {
  version: 'v0.11',
  updateComponents: {
    surfaceId: 'main',
    components: [
      // ── Root ──────────────────────────────────────────────
      {
        id: 'root',
        component: 'Column',
        children: ['header', 'tabs'],
      },

      // ── Header ────────────────────────────────────────────
      {
        id: 'header',
        component: 'Row',
        children: ['header-img', 'header-bio'],
      },
      {
        id: 'header-img',
        component: 'Image',
        src: 'https://lipyeow.github.io/info/img/lipyeow-20210926-b.jpg',
        height: '180px',
        margin: '8px 4em 0 4em',
      },
      {
        id: 'header-bio',
        component: 'RichContent',
        htmlContent: `
<h1>Lipyeow Lim, Ph.D. \u00a0 \u00a0 林立耀 </h1>
<i>I am a computer scientist, educator, and software engineer by profession</i>
<div align="right"><i> -- and a martial artist by avocation.</i></div>

<br/>
Dublin, CA, USA
\u00a0 ⬥ \u00a0
<a href="https://lipyeow.github.io/home/cv/resume.pdf">Résumé (pdf)</a>
\u00a0 ⬥ \u00a0
lipyeow at gmail dot com
\u00a0 ⬥ \u00a0
<a href="https://www.linkedin.com/in/lipyeowlim">www.linkedin.com/in/lipyeowlim</a>`,
      },

      // ── Tabs ──────────────────────────────────────────────
      {
        id: 'tabs',
        component: 'Tabs',
        tabs: [
          { title: 'Computer Scientist', child: 'tab-panel-0' },
          { title: 'Educator', child: 'tab-panel-1' },
          { title: 'Software Engineer', child: 'tab-panel-2' },
          { title: 'Martial Artist', child: 'tab-panel-3' },
        ],
      },

      // ── Tab 0: Computer Scientist ─────────────────────────
      {
        id: 'tab-panel-0',
        component: 'Column',
        children: ['cs-intro', 'cs-edu-heading', 'cs-edu-list', 'cs-pubs-heading', 'cs-pubs'],
      },
      {
        id: 'cs-intro',
        component: 'Markdown',
        content: `*My scientific research career started with my masters thesis
on pixel ordering in images. I then investigated the use of
machine learning techniques in optimizing database processing
in my doctoral dissertation. I continued with more general
data management research at the **IBM Thomas J. Watson Research
Center** early in my career before embarking on a professorship
at the **University of Hawaii at Manoa**. I left academia in 2019 and continued by research endeavors in the industry.*`,
      },
      {
        id: 'cs-edu-heading',
        component: 'Heading',
        level: 2,
        text: 'Education',
      },
      {
        id: 'cs-edu-list',
        component: 'Markdown',
        content: `- 2004 - **Ph.D.** Computer Science, Duke University.
  Thesis: *Online Methods for Database Optimization*.
  Advisor: [Jeffrey Scott Vitter](https://en.wikipedia.org/wiki/Jeffrey_Vitter)
- 2000 - **M.Sc.** Information Systems & Computer Science, National University of Singapore.
  Thesis: *A Theoretical Look at Pixel Ordering*.
  Advisor: [Philip M. Long](http://phillong.info/)
- 1999 - **B.Sc.** Information Systems & Computer Science, National University of Singapore.
  Project: *Implementation of the mobile IPv4 configuration option for PPP IPCP (RFC 2290)*.
  Advisor: [Yong-Chiang (Y.C.) Tay](https://www.comp.nus.edu.sg/cs/bio/tayyc/)`,
      },
      {
        id: 'cs-pubs-heading',
        component: 'Heading',
        level: 2,
        text: 'Publications',
      },
      {
        id: 'cs-pubs',
        component: 'DataTable',
        label: '<i>Scientific articles I have (co-)authored.</i>',
        dataUrl: 'https://lipyeow.github.io/info/data/pubs.json',
        colspecs: [
          { title: 'Year', field: 'year', defaultSort: 'desc' },
          { title: 'Venue', field: 'venue' },
          { title: 'Title', field: 'title', cellStyle: { minWidth: '350px' } },
          { title: 'Authors', field: 'authors' },
          {
            title: 'pdf',
            field: 'pdf',
            link: { prefix: 'https://lipyeow.github.io/home/', text: 'pdf' },
          },
        ] as ColSpec[],
        options: {
          search: true,
          paging: false,
          exportButton: true,
          maxBodyHeight: '70vh',
          padding: 'dense',
          headerStyle: { backgroundColor: '#FDEBD0' },
        } as TableOptions,
      },

      // ── Tab 1: Educator ───────────────────────────────────
      {
        id: 'tab-panel-1',
        component: 'Column',
        children: ['edu-intro', 'edu-students-heading', 'edu-students', 'edu-courses-heading', 'edu-teaching'],
      },
      {
        id: 'edu-intro',
        component: 'Markdown',
        content: `*Between 2009 and 2019, I was a professor of Information and Computer Science at the University of Hawaii at Manoa where I taught both undergraduate and graduate courses and advised Masters and Doctoral students.*`,
      },
      {
        id: 'edu-students-heading',
        component: 'Heading',
        level: 2,
        text: 'Student Advisees',
      },
      {
        id: 'edu-students',
        component: 'DataTable',
        label: '<i>Students I have had the privilege of mentoring</i>',
        dataUrl: 'https://lipyeow.github.io/info/data/students.json',
        colspecs: [
          { title: 'Year', field: 'year' },
          { title: 'Degree', field: 'degree' },
          { title: 'Name', field: 'name', cellStyle: { minWidth: '250px' } },
          { title: 'Thesis', field: 'thesis', cellStyle: { minWidth: '550px' } },
        ] as ColSpec[],
        options: {
          search: true,
          paging: false,
          exportButton: true,
          maxBodyHeight: '50vh',
          padding: 'dense',
          headerStyle: { backgroundColor: '#FDEBD0' },
        } as TableOptions,
      },
      {
        id: 'edu-courses-heading',
        component: 'Heading',
        level: 2,
        text: 'Courses',
      },
      {
        id: 'edu-teaching',
        component: 'DataTable',
        label: '<i>Undergraduate and graduate courses I have taught</i>',
        dataUrl: 'https://lipyeow.github.io/info/data/teaching.json',
        colspecs: [
          { title: 'Year', field: 'year', defaultSort: 'desc' },
          { title: 'Semester', field: 'semester' },
          { title: 'Course', field: 'num' },
          { title: 'Title', field: 'title', defaultGroupOrder: 0 },
          { title: 'Level', field: 'level' },
          { title: 'Website', field: 'url', link: { text: '' } },
        ] as ColSpec[],
        options: {
          search: true,
          paging: false,
          exportButton: true,
          maxBodyHeight: '50vh',
          padding: 'dense',
          grouping: true,
          headerStyle: { backgroundColor: '#FDEBD0' },
        } as TableOptions,
      },

      // ── Tab 2: Software Engineer ──────────────────────────
      {
        id: 'tab-panel-2',
        component: 'Column',
        children: ['swe-intro', 'swe-patents-heading', 'swe-patents-list', 'swe-projects-heading', 'swe-projects'],
      },
      {
        id: 'swe-intro',
        component: 'Markdown',
        content: `*My first serious software engineering endeavor was writing a
linux kernel module for supporting the PPP protocol over MobileIP back in 1998.
I then progressed to prototyping various research ideas during my graduate
studies. My software engineering career really began at **IBM** developing advance
features for DB2 DBMS and Infosphere Streams software. I then took a break in
academia teaching students how to write data-intensive software applications as
well as advising developing nations on their IT projects as a **World Bank**
consultant. In 2019, I returned to industry (to **FireEye Inc.**) to lead
data-intensive cybersecurity software projects.
In 2022, I joined **Databricks Inc.** as a technical director to lead the cybersecurity GTM for the Lakehouse platform. In 2023, I joined **Splunk Inc.** as Technical Assistant to the CTO to advance Splunk's data lake strategy and in 2024 I took on the role of Senior Director to lead the Splunk AI Toolkit Engineering team. In 2025, I joined the startup **Crogl Inc.** as Distinguished Engineer and Head of AI to revolutionalize security operations.*`,
      },
      {
        id: 'swe-patents-heading',
        component: 'Heading',
        level: 2,
        text: 'Patents',
      },
      {
        id: 'swe-patents-list',
        component: 'Markdown',
        content: `- A list of [my patents](https://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=0&f=S&l=50&TERM1=Lipyeow&FIELD1=INNM&co1=AND&TERM2=Lim&FIELD2=INNM&d=PTXT) (~29) at USPTO Patent Full-Text and Image Database.
- A list of [my patent applications](https://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=0&f=S&l=50&TERM1=Lipyeow&FIELD1=IN&co1=AND&TERM2=Lim&FIELD2=IN&d=PG01) (~35) at USPTO Patent Application Full-Text and Image Database.`,
      },
      {
        id: 'swe-projects-heading',
        component: 'Heading',
        level: 2,
        text: 'Projects',
      },
      {
        id: 'swe-projects',
        component: 'DataTable',
        label: '<i>Interesting projects I have worked on.</i>',
        dataUrl: 'https://lipyeow.github.io/info/data/projects.json',
        colspecs: [
          { title: 'Dates', field: 'display_date', cellStyle: { minWidth: '100px' } },
          { title: 'Title', field: 'title', cellStyle: { minWidth: '140px' } },
          { title: 'Role', field: 'role', cellStyle: { minWidth: '100px' } },
          { title: 'Affiliation', field: 'affiliation', cellStyle: { minWidth: '100px' } },
          { title: 'Description', field: 'desc', cellStyle: { minWidth: '350px' } },
        ] as ColSpec[],
        options: {
          search: true,
          paging: false,
          exportButton: true,
          maxBodyHeight: '70vh',
          padding: 'dense',
          headerStyle: { backgroundColor: '#FDEBD0' },
        } as TableOptions,
      },

      // ── Tab 3: Martial Artist ─────────────────────────────
      {
        id: 'tab-panel-3',
        component: 'Column',
        children: ['ma-intro', 'ma-ilc-section', 'ma-kalis-section', 'ma-taiji-section'],
      },
      {
        id: 'ma-intro',
        component: 'Markdown',
        content: `*Studying, training and teaching martial arts is a big part of my life. I
started learning **Chen Style Taijiquan** in Singapore from Sifu Chen
Hui-Qiu and Sifu Hu Su-Tan in 1993. I was then seconded to study under
Grandmaster Zhu Tian-Cai for several years even during my doctoral studies at
Duke University. I met [Sifu Sam Chin](https://iliqchuan.com/grand-master-sam-fs-chin/) in 2004 at a park in Manhattan's Chinatown
on a Sunday and have since studied the art of **I Liq Chuan** with him.
In Honolulu, I briefly dabbled in edge and blunt weapons while studying **Kalis Illustrissimo** with Lowell Manabe from 2017 to 2018.*`,
      },

      // ── I Liq Chuan Section ──
      {
        id: 'ma-ilc-section',
        component: 'Section',
        children: ['ma-ilc-img', 'ma-ilc-heading', 'ma-ilc-text'],
      },
      {
        id: 'ma-ilc-img',
        component: 'Image',
        src: 'https://lipyeow.github.io/home/img/sigong.jpg',
        float: 'left',
        width: '500px',
        margin: '0 1em 1em 0',
        border: '1',
        caption: '<i>Photo: Kuala Lumpur, Malaysia, 2010. Starting bottom left: Kelley, Lipyeow, Ion, Sigong Chin Lik Keong, Hsin, Andy, Johnny.</i>',
      },
      {
        id: 'ma-ilc-heading',
        component: 'Heading',
        level: 2,
        text: 'I Liq Chuan 意力拳',
      },
      {
        id: 'ma-ilc-text',
        component: 'Markdown',
        content: `I consider **I Liq Chuan** my primary art. As an internal martial art, I Liq Chuan's curriculum is the Ph.D. program of martial arts: not only does it cover mechanics and physical movement principles, but it dives into the cognitive processes of learning and of the interaction between you and your opponents.

I Liq Chuan was founded by Sigong Chin Lik Keong in Kuala Lumpur, Malaysia, synthesizing and distilling the various chinese martial arts traditions he had learned. The above-mentioned curriculum was the culmination of decades of teaching by Sifu Sam (Fan Siong) Chin after he emigrated to the United States. Note that the curriculum defers from those from other branches of I Liq Chuan.

I have taught I Liq Chuan since 2007: in New York (2007-2009), in Honolulu (2009-2019). I have also organized I Liq Chuan workshops by Sifu Sam Chin in Honolulu between 2010 to 2015.`,
      },

      // ── Kalis Illustrissimo Section ──
      {
        id: 'ma-kalis-section',
        component: 'Section',
        children: ['ma-kalis-img', 'ma-kalis-heading', 'ma-kalis-text'],
      },
      {
        id: 'ma-kalis-img',
        component: 'Image',
        src: 'https://lipyeow.github.io/home/img/20190609_kalis.jpg',
        float: 'right',
        width: '500px',
        margin: '1em 0 1em 1em',
        border: '1',
        caption: '<i>Photo: Honolulu, HI, 2019. Lipyeow, Rod, and Lowell</i>',
      },
      {
        id: 'ma-kalis-heading',
        component: 'Heading',
        level: 2,
        text: 'Kalis Illustrissimo',
      },
      {
        id: 'ma-kalis-text',
        component: 'Markdown',
        content: `A fortuitous meeting of Lowell Manabe and Rod Watson practising Kalis Illustrissimo at Noelani Elementary School in Honolulu, HI, led to two years of weapons training with Lowell Manabe. Lowell Manabe studied under various Balintawak teachers and the Kalis Illustrissimo group under Tony Diego in the Philippines. The beauty of the escrima framework is the distillation of all blunt-and-edge, long-and-short weapons into a set of unifying principles.`,
      },

      // ── Chen Style Taijiquan Section ──
      {
        id: 'ma-taiji-section',
        component: 'Section',
        children: ['ma-taiji-img', 'ma-taiji-heading', 'ma-taiji-text'],
      },
      {
        id: 'ma-taiji-img',
        component: 'Image',
        src: 'https://lipyeow.github.io/home/img/jk-ztc01.JPG',
        float: 'left',
        width: '500px',
        margin: '1em 1em 1em 0',
        border: '1',
        caption: '<i>Photo: Durham, NC, 2001. Starting middle row left: Johnny, Genevieve, Jay, CP Ong, GM Zhu Tian Cai, Lipyeow, and Olivia.</i>',
      },
      {
        id: 'ma-taiji-heading',
        component: 'Heading',
        level: 2,
        text: 'Chen Style Taijiquan 陳氏太極拳',
      },
      {
        id: 'ma-taiji-text',
        component: 'Markdown',
        content: `I started learning Chen style Taijiquan at a class in Yishun, Singapore in circa 1993. I am grateful to my teachers Chen Hui-Qiu and Hu Su-Tan for cultivating my interest and for their meticulous instruction in the nuances of Chen style Taijiquan. A few years later, my primary teachers recommended that I study under GM Zhu Tian-Cai, one of the four tigers or buddha warriors of Chen village Taijiquan.

I have taught Taijiquan as a teaching assistant in Singapore from 1995 to 1999. During my graduate studies at Duke University between 1999 and 2004, I started a Taijiquan Club, taught Chen Style Taijiquan, and organized several workshops for GM Zhu Tian-Cai.`,
      },
    ],
  },
};
