---
title: Claude Codeで実用的なWebサービスを作る｜himara2
source: https://note.com/himaratsu/n/nddf0efa67d42
author:
  - "[[himara2]]"
published: 2025-06-17
created: 2025-06-19
description: こんにちは！ひまらつ（@himara2）です。  Claude Codeが話題ですね。実際に使ってみるとClineやCursorなどのAIエージェントと比べて賢さのレベルが高く、開発アシスタントとして次のレベルに来ているような気がします。  サンプルアプリやプロトタイプを作れるのは確実なので、今回はデータベースを持つ実用的なアプリケーションをどれくらい作れるか試してみました。これからClaude Codeを触る方のヒントとなれば幸いです:)  今回作ったもの 麻雀点棒管理アプリを作った 麻雀をするときに点数の管理をするWebアプリです。  定期的に友人と麻雀をしてるんですが、友人宅にあ
tags:
  - clippings
updated: 2025-06-21T11:46
---
![見出し画像](https://assets.st-note.com/production/uploads/images/196694012/rectangle_large_type_2_76e170fc96d4fddf75c9d615478cc01d.png?width=1200)

## Claude Codeで実用的なWebサービスを作る

[himara2](https://note.com/himaratsu)

こんにちは！ひまらつ（ [@himara2](https://x.com/himara2) ）です。

Claude Codeが話題ですね。実際に使ってみるとClineやCursorなどのAIエージェントと比べて賢さのレベルが高く、開発アシスタントとして次のレベルに来ているような気がします。

サンプルアプリやプロトタイプを作れるのは確実なので、今回はデータベースを持つ実用的なアプリケーションをどれくらい作れるか試してみました。これからClaude Codeを触る方のヒントとなれば幸いです:)

## 今回作ったもの

![画像](https://assets.st-note.com/img/1750152920-5zARtHfqjMd4b2wWTEeXK8Ih.png?width=1200)

麻雀点棒管理アプリを作った

麻雀をするときに点数の管理をするWebアプリです。

定期的に友人と麻雀をしてるんですが、友人宅にある自動雀卓機が点数表示に対応していないモデルで毎回ちょっとだけ困っていたのでその解決が目的です。

課題としては超ニッチです。このWebアプリが爆発的にヒットする可能性はまずありませんが、 **AI開発はコストが低いので自分専用のアプリを気軽に作ることができます** 。とはいえ使いづらかったりバグだらけだと使う気が起きないので、「本気で」使いたいと思える基準を目指します。

↓作ったものはこちらからアクセスできます

[**スマート点棒管理** *麻雀の点棒計算を管理するアプリケーション* *smart-point-stick.vercel.app*](https://smart-point-stick.vercel.app/)

## Claude Codeの準備をする

Claude CodeはCLIベースのツールです。つまり画面を持たずターミナル上で操作することになります。

セットアップは簡単です。

- Claude Codeをインストール
- 作業したいディレクトリに移動
- claude コマンドで起動

コマンド的にはこんな感じです：

```java
// 1. インストール
npm install -g @anthropic-ai/claude-code

// 2. 作業ディレクトリに移動
cd your-project-directory 

// 3. 起動
claude
```

初回起動時には料金プランを尋ねられます。  
現在は3つのプランがあり、以下の3パターンから選ぶことになります。

- Anthropic APIキーを利用（従量課金）
- Claude Maxプランを利用（定額で毎月 $100 または $200）
- Claude Proプランを利用（定額で毎月 $20。最近追加された）

まずはAnthropic APIキーで試し、気に入れば定額プランを検討するのが良いかと思います。定額プランの比較だと1日2-3時間くらいの利用ならProで十分とも言われています。自分はMaxプランを契約していて、リミットを気にせず使えるので大変満足しています。

## 要件を伝えてCLAUDE.mdを作る

新規でプロジェクトを立ち上げるとき、 **いきなりコーディングを依頼するのではなく、まずは要件を整理する** のが有効です。

Claudeを立ち上げ、チャットから以下のように会話を開始します。

> 麻雀の点棒管理アプリを作りたいです。  
> いろいろ要件を伝えるので、それを参考にCLAUDE.mdを作ってください。

そうすると要件を決めるために必要な情報を聞いてもらえるので応えましょう。自分の場合は以下のような内容を伝えることが多いです。

- 基本的な機能
- デザインのイメージ
- データベースは必要か
	- 今回はFirestoreを指定
- 利用する言語やフレームワーク
	- 今回はTypeScript, Next.js, TailwindCSS, Mantineを指定

詳細に伝えると、与えた内容からCLAUDE.mdを作成してくれます。

![画像](https://assets.st-note.com/img/1750136483-FEmacotsd5rbBLJP3i80G2ZN.png?width=1200)

Claude Desktopに壁打ちして要件をまとめる

![画像](https://assets.st-note.com/img/1750136700-FVGnTN7AyEMtq1gdu4pvP9W8.png?width=1200)

要件をCLAUDE.mdとして出力。これで準備はOK

**CLAUDE.md というのはClaude Code起動時に自動で読み込んでくれるファイル** です。このファイルがあることでプロジェクトの文脈をClaude Codeに伝えることができます（既存プロジェクトでClaude Codeを始めるときは /init コマンドでコードベースから作ってくれる）。

## 最初の雛形を実装してもらう

作成したCLAUDE.mdをプロジェクトのルートに置き、Claude Codeを起動します。

Claude Codeに以下のように指示しましょう。

> CLAUDE.mdを参考に実装を進めて

指示の内容からタスクリストを作り、上から順番に作業が進みます。

![画像](https://assets.st-note.com/img/1750137127-oQl8prA1TDk3cRmjwbEG7VBu.png?width=1200)

CLAUDE.mdを参考に実装を進めてもらう

コマンドの実行が必要な場合は確認されます。

![画像](https://assets.st-note.com/img/1750137177-h40v2O91TZsEwg7RVtpPq6Ha.png?width=1200)

コマンド実行前に確認のステップが入る

- Yes
- Yes（今後は確認なしで実行してOK）
- No（理由を伝える）

の3択から選んで答えていきます。

しばらく待つと実装が完了しました。

![画像](https://assets.st-note.com/img/1750138756-wylQv1ApLSP4MqsN0rRfuT7I.png?width=1200)

CLAUDE.mdで指示した内容をもとに最初の実装が完了

Firestoreのセットアップ方法も聞きましょう。教えてくれた通りに操作しました。

![画像](https://assets.st-note.com/img/1750138801-A1vY7KmMTOPNrDl3B5xoFUQR.png?width=1200)

データベースのセットアップ手順なども教えてくれる

指示された通り環境変数をセットして npm run dev したところ、無事ローカルサーバーが立ち上がりました！

![画像](https://assets.st-note.com/img/1750138859-xetB89J6GVC3LnX72PaDTKHk.png?width=1200)

最初のアウトプット。要件通りに機能が実装されている

![画像](https://assets.st-note.com/img/1750138865-NwEgPY51zF2UmVfns60qlDj4.png?width=1200)

麻雀についての知識から専門用語も使われている

動くものができました！色使いなども含めてシンプルで見やすい仕上がりになっています。 **要件で伝えていた通りスマホ対応もされてるし、スコアや履歴はデータベース（Firestore）に保存されるようになっています** 。

「テンパイ」などの麻雀用語はこちらが与えたのではなく、Claudeが持つ知識や検索により勝手に補完してくれてます。この辺りも気が利いてて良いですね。

これで簡単なプロトは出来ましたが、自分が"使いたいと思える"Webサービスにはまだまだです。追加の指示を与えて磨いていきましょう。

## 機能の変更や追加を依頼する

いろいろと修正の指示をしていきます。基本的にはチャットでタスクを依頼していくだけなので、ここでは特に大きめの変更になったものをいくつか紹介します。

### Mantineを使ってもらう

作られたサービスを見た感じ、Tailwindは採用されてますがMantineが使われてないようです。修正してもらいましょう：

> Mantineを使って全体的に書き直して

![画像](https://assets.st-note.com/img/1750139706-r4McGNnovQ6VBFp5yS7OiPgC.png?width=1200)

Mantineを使って書き直してもらった

Mantineを使ったデザインになりました。見づらい部分がまだありますが、それは細かく指示して修正していきます。

### 点数入力を改善する

点数の入力しやすさはこのアプリの肝です。画面の小さいスマホでも押しやすいようにボタンを大きくしてもらいます。

> 点数入力画面を改善して。  
> 電卓のような表示にして、一つずつのボタンは大きくタップしやすくしてほしい。

![画像](https://assets.st-note.com/img/1750139901-sLGynagE3z9djJPw05VlBMIx.png?width=1200)

点数入力画面。依頼通り大きくて押しやすい

点数入力画面が改善されました。大きくて操作しやすく、「電卓のような」という指示が守られていますね。

### スコア計算画面の追加

ゲーム終了後、順位点なども含めてスコアを出す必要があります。

> スコアを計算する画面を追加します。  
>   
> 順位点  
> 1位: +20 / 2位: +10 / 3位: -10 / 4位: -20  
>   
> オカ  
> 1位: +20  
>   
> 飛ばし賞  
> 点数がマイナスになった人は-10 / 和了でマイナスにさせた人は+10  
>   
> 素点  
> 30000点を基準に計算します。1000の位で切り上げ・切り下げします。30000点以下なら切り上げ、30000点より大きければ切り下げます。  
> 例. 17,500点 → -12, 37200点 → +17  
>   
> これらを計算して、画面上に順位を添えてわかりやすく表示して。

![画像](https://assets.st-note.com/img/1750140078-begMtP8xYKd3VwND1Cim6Gsl.png?width=1200)

スコア画面。人間がやると多少時間がかかるので便利

こんな感じの画面が作られました。

計算ロジックがやや複雑なためか、最初はスコアの計算を一部間違えていました。その後2-3回会話を往復して正解を出せるように。追加の指示を理解する能力もとても高いです。

### 心地よいアニメーションを追加する

点数移動があったとき、持ち点が急に変化してもどこが変わったか把握できません。アニメーションをつけてみましょう。

> 点数が移動するとき、数字の増減がカウントアップ・カウントダウンするアニメーションをつけて。アニメーションが完了したら、+3900 のようにスコアの差分を表示するようにして。

![画像](https://assets.st-note.com/production/uploads/images/196652513/picture_pc_66061db96f5935eea55cbf4475beabcb.gif)

AIは文言変更と同じくらいのテンションでアニメーションを実装できる

アニメーションを実装してくれました。いい感じ！  
調べながら実装すれば自力でもできそうではありますが、チャット一発でここまで実装できるのはうれしいです。

---

その他にも細かく指示を続け、2時間程度で求めるクオリティに達しました。大きな修正はもちろん、文言や色の変更など細かい修正もすべてチャットで指示しています。

これまでのAIエージェントだとたまに暴走して影響範囲を拡げてしまうことがありましたが、Claude Codeはそれがほとんどないので安心して任せられました。

### よく使うコマンド・Tips

チャットのやり取りをする中でよく使ったコマンドなどを紹介します。

- /clear
	- そこまでの会話履歴をクリア
	- 依頼するタスクの内容が切り替わるときはclearすると大事な部分に集中してくれます
- resume
	- 中断したセッションを再開
	- claude --continue で最新の会話を継続してスタート
	- claude --resume で過去の会話ポイントを選択してそこからスタート
- Esc
	- Esc を一度押すと作業をストップします。自分の指示が不足していて指示内容を間違えてそうだと思ったらすぐ止めます
- Esc x 2
	- 過去の会話ポイントが表示され、選択するとその時点からやり直せます
- 計画モード
	- Shift + Tab を押すごとに「通常モード」「自動編集モード」「計画モード」と切り替わります
	- 実装にはまだ取り掛からず、計画だけ立てて欲しいときは計画モードが便利です。まず設計してから実装を依頼するフローは [Claude Codeのベストプラクティス](https://www.anthropic.com/engineering/claude-code-best-practices) にも書かれています
- ultrathink
	- Claude Codeには特別なフレーズがあり、「think」「think hard」「think harder」「ultrathink」の順に深く思考します
	- 迷走していた難しいタスクが、ultrathink をつけるとうまくいくことが何度かありました
- /cost
	- ここまでにかかった費用を表示するコマンド
	- 定額プランの場合は表示されません
- /model
	- 選択中のモデルを表示するコマンド
	- Opus 4は賢いですがリミットに至るまでが早くなります。Sonnet 4でも十分賢いので上手く使い分けましょう
- npm run dev は別プロセスで
	- Claude Codeが気を利かせて開発サーバーを立ててくれたりしますが、それだと外部のブラウザからアクセスできないようでした
	- 別のターミナルを開いて表示しておき、Claude Codeの変更内容がHot Reloadされるような形で開発しました

### 定期的にCLAUDE.mdを更新する

機能追加を繰り返していくと初回に用意したCLAUDE.mdの仕様が古くなっていきます。  
AIが要件を間違えないよう、定期的にCLAUDE.mdを更新しましょう。

> コードベース全体を読んでCLAUDE.mdにアップデート分を反映して

こうして指示すればいい感じに更新してくれます。

## 作ったサービスをデプロイする

ここまでで開発は完了です。ローカルPCだけでなく自身や友人のスマホからアクセスできるように、作ったWebアプリをデプロイしましょう。

デプロイ先は [Vercel](https://vercel.com/) を選びました。GitHubと連携させてすぐデプロイできるので便利です。非商用なら無料で使えるのもうれしいですね。

[**スマート点棒管理** *麻雀の点棒計算を管理するアプリケーション* *smart-point-stick.vercel.app*](https://smart-point-stick.vercel.app/)

## 素材を添えて彩りをつける

自分専用のアプリではありますが、装飾があるとテンションがあがります。麻雀っぽい素材を作ってトップページに配置することにしましょう。

ChatGPTに依頼して素材を作ってもらいます。

> 次の指示に従ってWebサービスの背景イラストを作ってください。  
>   
> \-----  
> 麻雀の点棒計算アプリです。  
> シンプルで、色合いが落ち着いた麻雀牌と点棒のイラストです。

こんなイラストを作ってくれました。

![画像](https://assets.st-note.com/img/1750141959-KuWe47EaHz0BmxUrnof8spGh.png?width=1200)

ChatGPTが作ってくれたイラスト素材

可愛いですね。  
ただWebページに置くには背景を透過して欲しいです。位置も右下ではなく中央に表示して欲しいので、修正を依頼します。

> 2点修正してほしいです。  
>   
> 1\. 背景を透過してください  
> 2\. 要素は中央に配置してください

これで編集してくれたのが以下のイラストです。

![画像](https://assets.st-note.com/img/1750142059-8bnLoma1K7zMVW5DSiUeAGE4.png?width=1200)

ChatGPTに指示して修正されたイラスト素材。背景が透過になっている

これを採用してトップページに載せました。↓こんな感じ。

![画像](https://assets.st-note.com/img/1750142113-If7qCTieUpkRKNMdG69Lom81.png?width=1200)

素材をトップページに適用

自分用アプリとしては十分なクオリティとなりました。この素材を使って、Canvaで [OGP画像](https://smart-point-stick.vercel.app/ogp.png) も作っています。

同じ要領でfaviconも作ってもらっています。AIのおかげでちょっとした工夫を施しやすくなりましたね。

## その他試したこと

- git worktreeでの並行作業
	- Claude Codeを複数同時に走らせられます
	- 機能開発、不具合修正、デザイン修正と3つのレーンを立てて使ってみましたが爆速です。ただ人間がボトルネックになります
	- git worktreeについてはこちらの記事が詳しいです
		- [https://zenn.dev/siu\_issiki/articles/git\_worktree](https://zenn.dev/siu_issiki/articles/git_worktree)
- 仕様自体は人間が考えないといけない
	- デザインの方向性やスコア計算ロジックなど、AIが「よしなに」やってくれることはありません
	- どういう仕様にしたいか、どう見せればシンプルに感じるかを決めるのは引き続き人間の仕事になりそうです
- IDE連携
	- CursorなどのIDEのターミナルからも実行できます
	- 今回はすべてチャットだけで完結させたので使いませんでしたが、ファイルの差分表示などはIDEの良さですね

## おわりに

「こういうサービスがあればいいのに」というアイデアは浮かんでも、それを実現するのは中々大変です。AIエージェントに任せればもっと気軽に自分向けアプリを作れます。今回作ったものは設計からデプロイまで含めて半日ほどでできました。データベースを使ってそれなりに機能もあるアプリにしてはすごい速さだと思います。

Webサービスだけでなく自分用のツール、一度しか使わない使い捨てのスクリプトなども今後は気軽に作っていけそうです。Claude Codeをまだ試してない方はぜひ一度使ってみてください。

Claude Codeで開発して気づいたTipsをXにPOSTしてるので、よければ [@himara2](https://x.com/himara2) をフォローしてね:)  
最後までお読みいただきありがとうございました！

  

Claude Codeで実用的なWebサービスを作る｜himara2