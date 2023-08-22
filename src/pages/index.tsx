import { FC } from "react"
import Link from 'next/link'

const Index: FC = () => (
  <>
    <div>
      <h1>KNIW</h1>
    </div>
    <div>
        <p>
        kniwは、Tactics Ogreを参考に作ったボードゲームです。
        <br/>
        このアプリケーションでは以下のことを行うことができます。
        <ul>
          <li>ゲームの準備 <Link href="/party"><a>Partyの作成</a></Link></li>
          <li>ゲームの進行 <Link href="/battle"><a>Battleの管理</a></Link></li>
        </ul>
        <br/>
        更に詳しい説明は<a href="https://github.com/motojouya/kniw">こちらのページ</a>を参照してください。
      </p>
    </div>
  </>
)

export default Index
