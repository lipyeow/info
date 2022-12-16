import { edu_data } from "./data.js";

// text:
//  - widths are in grid xs units
//  - justify is passed to grid container justifyContent prop
const app_spec = {
  widgets: [
/*
    {
      type: "image",
      id: "img1",
      width: 3,
      imageheight: "170px",
      justify: "center",
      value: "https://lipyeow.github.io/info/img/lipyeow-20210926-b.jpg",
    },
*/
    {
      type: "text",
      id: "img1",
      width: 3,
      justify: "flex-start",
      value: `
      <figure
            style="float:left;margin:8px 4em 0 4em;height:180px;" 
      >
        <img src="https://lipyeow.github.io/info/img/lipyeow-20210926-b.jpg"
            style="height:180px;" 
        />
      </figure>
      `,
    },
    {
      type: "text",
      id: "txt2",
      width: 8,
      justify: "flex-start",
      value: `
      <h1>Lipyeow Lim, Ph.D. &nbsp; &nbsp; &#26519;&#31435;&#32768; </h1>
      <i>I am a computer scientist, educator, and software engineer by profession</i>
      <div align="right"><i> -- and a martial artist by avocation.</i></div>
      
      <br/>
      Dublin, CA, USA
      &nbsp ⬥ &nbsp 
      <a href="https://lipyeow.github.io/home/cv/resume.pdf">Résumé (pdf)</a>
      &nbsp ⬥ &nbsp 
      lipyeow at gmail dot com
      &nbsp ⬥ &nbsp 
      <a href="https://www.linkedin.com/in/lipyeowlim">www.linkedin.com/in/lipyeowlim</a>
      `,
    },
    {
      type: "tabcontainer",
      id: "tabcontainer01",
      style: {
            backgroundColor: "#FCF3CF",
            indicatorColor: "#DC7633",
        },
      tabs: [
        {
          label: " Computer Scientist",
          id: "tc01-0",
          idx: 0,
          widgets: [
            {
              type: "text",
              id: "txt4",
              width: 12,
              justify: "flex-start",
              value: `
                <i>My scientific research career started with my masters thesis 
                on pixel ordering in images. I then investigated the use of 
                machine learning techniques in optimizing database processing 
                in my doctoral dissertation. I continued with more general 
                data management research at the <b>IBM Thomas J. Watson Research
                Center</b> early in my career before embarking on a professorship
                at the <b>University of Hawaii at Manoa</b>.</i>

                <h2>Education</h2>

                <ul>
                <li>2004 - <b>Ph.D.</b> Computer Science, Duke University. 
                    <br/>
                    <ul>
                    Thesis: <i>Online Methods for Database Optimization</i>.
                    Advisor: <a href="https://en.wikipedia.org/wiki/Jeffrey_Vitter">Jeffrey Scott Vitter</a>
                    </ul>
                </li>
                <li>2000 - <b>M.Sc.</b> Information Systems & Computer Science, National University of Singapore. 
                    <br/>
                    <ul>
                    Thesis: <i>A Theoretical Look at Pixel Ordering</i>.
                    Advisor: <a href="http://phillong.info/">Philip M. Long</a>
                    </ul>
                </li>
                <li>1999 - <b>B.Sc.</b> Information Systems & Computer Science, National University of Singapore. 
                    <br/>
                    <ul>
                    Project: <i>Implementation of the mobile IPv4 configuration option for PPP IPCP (RFC 2290)</i>.
                    Advisor: <a href="https://www.comp.nus.edu.sg/cs/bio/tayyc/">Yong-Chiang (Y.C.) Tay</a>
                    </ul>
                </li>
                </ul>

                <h2>Publications</h2>
                `,
            },
            {
              type: "table",
              id: "tPub",
              label: "<i>Scientific articles I have (co-)authored.</i>",
              dataref: "qPub",
              colspecs: [
                { title: "Year", field: "year", defaultSort: "desc" },
                { title: "Venue", field: "venue" },
                {
                  title: "Title",
                  field: "title",
                  cellStyle: { minWidth: "350px" },
                },
                { title: "Authors", field: "authors" },
                {
                  title: "pdf",
                  field: "pdf",
                  link: {
                    prefix: "https://lipyeow.github.io/home/",
                    text: "pdf",
                  },
                },
              ],
              options: {
                search: true,
                paging: false,
                filtering: false,
                exportButton: true,
                maxBodyHeight: "70vh",
                padding: "dense",
                headerStyle: { backgroundColor: "#FDEBD0"},
              },
            },
          ],
        },
        {
          label: "Educator",
          id: "tc01-1",
          idx: 1,
          widgets: [
            {
              type: "text",
              id: "txt_educator",
              width: 12,
              justify: "flex-start",
              value: `
      <i>Between 2009 and 2019, I was a professor of Information and Computer Science at the University of Hawaii at Manoa where I taught both undergraduate and graduate courses and advised Masters and Doctoral students.</i>

        <h2>Student Advisees</h2>
      `,
            },
            {
              type: "table",
              id: "tStu",
              label: "<i>Students I have had the privilege of mentoring</i>",
              dataref: "qStu",
              colspecs: [
                { title: "Year", field: "year" },
                { title: "Degree", field: "degree" },
                {
                  title: "Name",
                  field: "name",
                  cellStyle: { minWidth: "250px" },
                },
                {
                  title: "Thesis",
                  field: "thesis",
                  cellStyle: { minWidth: "550px" },
                },
              ],
              options: {
                search: true,
                paging: false,
                filtering: false,
                exportButton: true,
                maxBodyHeight: "50vh",
                padding: "dense",
                tableLayout: "auto",
                headerStyle: { backgroundColor: "#FDEBD0"},
              },
            },
            {
              type: "text",
              id: "txt_courses_title",
              width: 12,
              justify: "flex-start",
              value: `<h2>Courses</h2>`,
            },

            {
              type: "table",
              id: "tTeach",
              label: "<i>Undergraduate and graduate courses I have taught</i>",
              dataref: "qTeach",
              colspecs: [
                { title: "Year", field: "year", defaultSort: "desc" },
                { title: "Semester", field: "semester" },
                { title: "Course", field: "num" },
                { title: "Title", field: "title", defaultGroupOrder: 0 },
                { title: "Level", field: "level" },
                {
                  title: "Website",
                  field: "url",
                  link: { text: "" },
                },
              ],
              options: {
                search: true,
                paging: false,
                filtering: false,
                exportButton: true,
                maxBodyHeight: "50vh",
                tableLayout: "auto",
                padding: "dense",
                grouping: true,
                headerStyle: { backgroundColor: "#FDEBD0"},
              },
            },
          ],
        },
        {
          label: "Software Engineer",
          id: "tc01-2",
          idx: 2,
          widgets: [
            {
              type: "text",
              id: "txt6",
              width: 12,
              justify: "flex-start",
              value: `
                <i>My first serious software engineering endeavor was writing a
linux kernel module for supporting the PPP protocol over MobileIP back in 1998.
I then progressed to prototyping various research ideas during my graduate
studies. My software engineering career really began at <b>IBM</b> developing advance
features for DB2 DBMS and Infosphere Streams software. I then took a break in
academia teaching students how to write data-intensive software applications as
well as advising developing nations on their IT projects as a <b>World Bank</b>
consultant. In 2019, I returned to industry (to <b>FireEye Inc.</b>) to lead
data-intensive cybersecurity software projects.
In 2022, I joined <b>Databricks Inc.</b> as a technical director to lead the cybersecurity GTM for the Lakehouse platform.
</i>

                <h2>Patents</h2>

                <ul>
                <li>A list of <a href="https://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=0&f=S&l=50&TERM1=Lipyeow&FIELD1=INNM&co1=AND&TERM2=Lim&FIELD2=INNM&d=PTXT">my patents</a> (~29) at USPTO Patent Full-Text and Image Database. </li>

                <li>
                A list of <a href="https://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=0&f=S&l=50&TERM1=Lipyeow&FIELD1=IN&co1=AND&TERM2=Lim&FIELD2=IN&d=PG01">my patent applications</a> (~35) at USPTO Patent Application Full-Text and Image Database. </li>
                </ul>

                <h2>Projects</h2>
                `,
            },
            {
              type: "table",
              id: "tProjects",
              label: "<i>Interesting projects I have worked on.</i>",
              dataref: "qProjects",
              colspecs: [
                {
                  title: "Dates",
                  field: "display_date",
                  cellStyle: { cellWidth: "15%" },
                },
                {
                  title: "Title",
                  field: "title",
                  cellStyle: { cellWidth: "20%" },
                },
                {
                  title: "Role",
                  field: "role",
                  cellStyle: { cellWidth: "15%" },
                },
                {
                  title: "Affiliation",
                  field: "affiliation",
                  cellStyle: { cellWidth: "15%" },
                },
                {
                  title: "Description",
                  field: "desc",
                  cellStyle: { minWidth: "350px" },
                },
              ],
              options: {
                search: true,
                paging: false,
                filtering: false,
                exportButton: true,
                maxBodyHeight: "70vh",
                padding: "dense",
                tableLayout: "auto",
                headerStyle: { backgroundColor: "#FDEBD0"},
              },
            },
          ],
        },

        {
          label: "Martial Artist",
          id: "tc01-3",
          idx: 3,
          widgets: [
            {
              type: "text",
              id: "txt_ma",
              width: 12,
              justify: "flex-start",
              value: `
<i>
Studying, training and teaching martial arts is a big part of my life. I
started learning <b>Chen Style Taijiquan</b> in Singapore from Sifu Chen
Hui-Qiu and Sifu Hu Su-Tan in 1993. I was then seconded to study under
Grandmaster Zhu Tian-Cai for several years even during my doctoral studies at
Duke University. I met <a href="https://iliqchuan.com/grand-master-sam-fs-chin/">Sifu Sam Chin</a> in 2004 at a park in Manhattan's Chinatown
on a Sunday and have since studied the art of <b>I Liq Chuan</b> with him.
In Honolulu, I briefly dabbled in edge and blunt weapons while studying <b>Kalis Illustrissimo</b> with Lowell Manabe from 2017 to 2018.
</i>

        <div>
        <figure
            style="float:left;margin:0 1em 1em 0;width:500px;" 
        >
          <img src="https://lipyeow.github.io/home/img/sigong.jpg"
            border="1"
            style="width:500px;" 
            />
        <figcaption><i>Photo: Kuala Lumpur, Malaysia, 2010. Starting bottom left: Kelley, Lipyeow, Ion, Sigong Chin Lik Keong, Hsin, Andy, Johnny.</i></figcaption>
        </figure>

        <h2>I Liq Chuan &#24847;&#21147;&#25331; </h2>

        <p>
                I consider <b>I Liq Chuan</b> my primary art. As an internal martial art, I Liq Chuan's curriculum is the Ph.D. program of martial arts: not only does it cover mechanics and physical movement principles, but it dives into the cognitive processes of learning and of the interaction between you and your opponents. 
        </p>
        <p>I Liq Chuan was founded by Sigong Chin Lik Keong in Kuala Lumpur, Malaysia, synthesizing and distilling the various chinese martial arts traditions he had learned. The above-mentioned curriculum was the culmination of decades of teaching by Sifu Sam (Fan Siong) Chin after he emigrated to the United States. Note that the curriculum defers from those from other branches of I Liq Chuan.</p>

        <p>I have taught I Liq Chuan since 2007: in New York (2007-2009), in Honolulu (2009-2019). I have also organized I Liq Chuan workshops by Sifu Sam Chin in Honolulu between 2010 to 2015. 
        </div>

        <div>
        <figure
            style="float:right;margin:1em 0 1em 1em;width:500px;" 
        >
        <img src="https://lipyeow.github.io/home/img/20190609_kalis.jpg"
            border="1"
            style="width:500px;" />
        <figcaption><i>Photo: Honolulu, HI, 2019. Lipyeow, Rod, and Lowell</i></figcaption>
        </figure>

        <h2>Kalis Illustrissimo</h2>

        <p>
        A fortuitous meeting of Lowell Manabe and Rod Watson practising Kalis Illustrissimo at Noelani Elementary School in Honolulu, HI, led to two years of weapons training with Lowell Manabe. Lowell Manabe studied under various Balintawak teachers and the Kalis Illustrissimo group under Tony Diego in the Philippines. The beauty of the escrima framework is the distillation of all blunt-and-edge, long-and-short weapons into a set of unifying principles.

        </p>
        </div>

        <div>
        <figure
            style="float:left;margin:1em 1em 1em 0;width:500px;" 
        >
        <img src="https://lipyeow.github.io/home/img/jk-ztc01.JPG"
            border="1"
            style="width:500px;" />
        <figcaption><i>Photo: Durham, NC, 2001. Starting middle row left: Johnny, Genevieve, Jay, CP Ong, GM Zhu Tian Cai, Lipyeow, and Olivia.</i></figcaption>
        </figure>

        <h2>Chen Style Taijiquan &#38472;&#27663;&#22826;&#26497;&#25331; </h2>

        <p>
        I started learning Chen style Taijiquan at a class in Yishun, Singapore in circa 1993. I am grateful to my teachers Chen Hui-Qiu and Hu Su-Tan for cultivating my interest and for their meticulous instruction in the nuances of Chen style Taijiquan.A few years later, my primary teachers recommended that I study under GM Zhu Tian-Cai, one of the four tigers or buddha warriors of Chen village Taijiquan. 
        </p>
        <p> 
        I have taught Taijiquan as a teaching assistant in Singapore from 1995 to 1999. During my graduate studies at Duke University between 1999 and 2004, I started a Taijiquan Club, taught Chen Style Taijiquan, and organized several workshops for GM Zhu Tian-Cai. 
        </p>
        </div>
      `,
            },
          ],
        },
      ],
    },
    {
      type: "query",
      id: "qPub",
      backend: "urlfetch",
      endpoint: "r0",
      query: "https://lipyeow.github.io/info/data/pubs.json",
      fetch_on_init: true,
      args: [],
    },
    {
      type: "query",
      id: "qStu",
      backend: "urlfetch",
      endpoint: "r0",
      query: "https://lipyeow.github.io/info/data/students.json",
      fetch_on_init: true,
      args: [],
    },
    {
      type: "query",
      id: "qTeach",
      backend: "urlfetch",
      endpoint: "r0",
      query: "https://lipyeow.github.io/info/data/teaching.json",
      fetch_on_init: true,
      args: [],
    },
    {
      type: "query",
      id: "qProjects",
      backend: "urlfetch",
      endpoint: "r0",
      query: "https://lipyeow.github.io/info/data/projects.json",
      fetch_on_init: true,
      args: [],
    },
    {
      type: "query",
      id: "qEduConst",
      backend: "constant",
      endpoint: "r0",
      query: {
        cols: [],
        data: edu_data,
      },
      args: [],
    },
  ],
};

export { app_spec };
