import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';

const JSON_URL = 'https://raw.githubusercontent.com/jvxiao/jvxiao.github.io/refs/heads/master/db.json'
const TARGET = 'README.md';

async function updatePostList() {
  try {
    const res = await axios.get(JSON_URL, {
      verify: false
    })
    const posts = res.data?.models?.Post || []
    // sort by  latest time
    posts.sort((p1, p2) => {
      console.log((new Date(p2.date)) - (new Date(p1.date)))
      return (new Date(p2.date)) - (new Date(p1.date))
    })
    // slice the top5
    let liststr = '';
    posts.slice(0, 6).forEach(p => {
      let url = `https://www.jvxiao.cn/posts/${p.slug}.html`;
      liststr += `- ${p.date.slice(0, 10)} [${p.title}](${url})\n`
    })
    liststr += `- [阅读更多...](https://www.jvxiao.cn/archives/)`;
    console.log(liststr)

    let readme = readFileSync(TARGET, 'utf-8').toString();
    readme = readme.replace(/(?<=<!-- blog-start-->)([\s\w\S]*)(?=<!-- blog-end -->)/, `\n${liststr}\n`);
    writeFileSync(TARGET, readme)
  }catch(err) {
    console.log(err)
  }
}

updatePostList()
