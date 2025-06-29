---
tags:
  - daily
  - news
date: 2025-06-20
created: 2025-06-20 08:57
updated: 2025-06-20T08:58
---

<% tp.file.cursor() %>

https://www.youtube.com/watch?v=djDZHAi75dk

---

## AIで生成されたウェブサイトの見た目を劇的に向上させる3つの方法と秘訣

AIが生成するウェブサイトが「ひどい」というご意見、正直なところよくわかります。「美しくして」「プロフェッショナルに見せて」とだけAIに指示しても、いつも同じような、つまらない、ありきたりなデザインになってしまうのは当然です。問題はAIそのものにあるのではなく、AIの**使い方**にあります。今回は、ウェブサイトを驚くほど美しく見せるための、3つの実績ある方法と、状況を一変させるような秘訣をご紹介します。

---

### 方法1：既存のデザインを完璧にクローンする

最初の方法は、すでに存在するデザインを**完璧に複製する**ことです。

#### 手順

1. **デザインプロファイルの抽出:** 複製したいデザインから、適切なデザインプロファイルを抽出します。例えば、このランダムなデザインをウェブサイト、ウェブアプリ、モバイルアプリに正確に再現したいとします。
2. **JSONデザインシステムの作成:** ClaudeやChatGPTなどのAIに、提供したビジュアルデータからすべての情報を抽出する**JSONデザインシステム**を作成するよう依頼します。
3. **AIにデザインシステムを適用:** このJSON出力をCursorに与えます。すると、一貫性のあるスタイリングが実現します。出力にはスタイル構造を含め、AIにはこのデザインを完璧に複製するために役立つその他の事項を自律的に決定させます。

これで、デザインを複製するために必要なすべてのデータを含むデザインシステムJSONファイルが完成しました。

#### 実践例

実際にテストしてみましょう。私たちは、「必要な機能をすべて備えた包括的な教育ダッシュボードを作成する」というプロンプトを与えました。この際、デザインについては何も触れず、ただHTML、CSS、JavaScriptでアプリを構築し、`design.json`ファイルに従うように指示しました。

その結果、ターゲットデザインと明確に一致する、美しいアプリが作成されました。クリーンな通知、狙い通りの魅力的なレイアウト、そして洗練されたナビゲーションバーまであります。AIに適切なデザインシステムを与えることの威力は、まさにここにあります。ただ「きれいに作って」と言うのではなく、具体的な指示を与えることが重要です。

---

### 方法2：Tweak CNでオリジナルのShad CN UIセットアップを作成する

デザインをコピーする際に方法1は完璧でしたが、全く**オリジナル**のものを作成したい場合はどうでしょうか？そんな時に役立つのが「Tweak CN」という素晴らしいウェブサイトです。

#### Tweak CNの活用

Tweak CNを使えば、オリジナルの完璧なShad CN UIセットアップをゼロから作成できます。Shad CN UIやコンポーネントに詳しくなくても心配ありません。これから例を示します。

このウェブサイトにアクセスしてカスタマイズを始めると、左側にプレビューインターフェースが表示され、自由にカスタマイズできます。例えば、「Colors」タブでは、スライダーをドラッグするだけで色を変更できます。これはメインカラーだけでなく、アクセントカラー、ベースカラー、さらにはカードの色まで完全にカスタマイズ可能です。

色だけでなく、タイポグラフィも変更できます。「Others」には、コンポーネントの影を調整する「Shadow」など、さらに多くのオプションがあります。シャッフルしてみると、作成できるさまざまな種類のカスタマイズやテーマがわかります。これらがデフォルトのオプションであることを考えると、自分でデザインできる可能性は無限大です。

これはカードタブに過ぎません。ダッシュボードやメールタブにもさらに多くのプレビューがあります。ダークモードとライトモードの両方でアプリがどのように表示されるかを確認することもできます。

気に入ったものが作成できたら、「Code」タブに移動し、コードをコピーしてディレクトリの`index.css`ファイルに貼り付けます。その後、方法1と同様に、このファイルからプロジェクトを構築するようにCursorに依頼します。

---

### 方法3：プレミアムコンポーネントでアプリを次のレベルへ引き上げる

方法1と2は全体的なデザインとスタイリングを整えるのに優れていましたが、方法3はアプリを**次のレベル**に引き上げるためのプレミアムコンポーネントに関するものです。

#### Reactコンポーネントの利用

特にReactでウェブアプリを作成している場合、Reactコンポーネントを使用すると、ウェブサイトやアプリが本当によく見えます。例えば、「React Bits」というライブラリには、アニメーション付きのReactコンポーネントがあります。これらは非常に見栄えがします。

他にも多くのコンポーネントライブラリがあり、「Aceternity UI」も多くの人に好評です。これらのライブラリの中には有料のものもありますが、AIにすべてを生成させるのではなく、無料のコンポーネントでも十分に価値のあるものが見つかります。

#### React Bitsコンポーネントの統合例

React Bitsライブラリのコンポーネントをアプリで使用してみましょう。

例として、この標準的なランディングページを使用します。CursorにNext.jsアプリをインストールし、後でカスタマイズできる6つのセクションを持つランディングページを作成するように指示しました。Cursorはすべてをセットアップし、全体を作成しました。

このページをカスタムコンポーネントでアップグレードしたいと思います。「強力な機能」セクションには基本的なカードがありますが、これを素晴らしい見た目にしたいとします。

React Bitsには、「Tinted Card」というコンポーネントがあります。この効果を見てください。カードを3Dにし、カーソルを動かすと傾きます。これこそ私たちが追加したいものです。さらに素晴らしいのは、コンポーネントをコピーする前にカスタマイズできることです。直接インストールするか、コードを取得できます。今回はコードを取得します。

コンポーネントのコード全体をコピーします。このコンポーネントには、正しく機能するために「Framer Motion」という前提条件が必要であることに注意してください。

#### Cursorでの実装

Cursorに戻り、何をしたいか正確に伝えます。

1. この機能を実装するセクションの名前を伝える。
2. 指定したセクションのカードとして、提供するコンポーネントを使用するよう伝える。
3. Framer Motionの依存関係がインストールされていることを確認させる。

コピーしたコンポーネントコード全体をプロンプトとしてCursorに与えます。

Cursorはコードの生成を終えました。少し時間がかかりましたが、結果を見てみましょう。以前の機能セクションが、カードにカーソルを合わせるとコンポーネントライブラリで見たのと同じ回転効果が完璧に機能しています。

#### 統合時の注意点

正直に言うと、統合中にいくつかのエラーに遭遇しました。コンポーネントが複雑な場合、いくつか問題が発生することがあります。例えば、使用したTinted Cardコンポーネントには、元のコードに背景画像がありました。Cursorは、それを見たときに自動的にストックのプレースホルダー画像を追加しました。それを削除するようにCursorに依頼する必要がありましたが、問題なく削除してくれました。

最終結果は、私たちが始めた基本的なカードと比較して、プロフェッショナルな見た目の滑らかな3D傾斜カードになりました。

---

### プロジェクトをプロフェッショナルに見せるための必須テクニック

上記の3つの方法で、素晴らしい見た目のアプリの基礎ができます。しかし、それ以外にも、アマチュアプロジェクトとプロのプロジェクトを分ける**重要な詳細**があります。

---

#### アニメーション

ウェブサイトやアプリにアニメーションを追加する場合の**黄金律**は、**やりすぎないこと**です。すべてをアニメーション化するように依頼すると、サイトはプロフェッショナルに見えず、気が散るものになります。

#### 正しいアニメーションの追加方法

3D効果を追加したい場合は、ChatGPTやClaudeに、特定のセクションにその効果を追加するためにCursorにどのようにプロンプトを出すべきか正確に尋ねてください。

ただし、ウェブサイトを実際に向上させる滑らかなアニメーションやマイクロインタラクションが必要な場合は、プロフェッショナルなサイトに必要な**微妙な動き**に焦点を当ててください。必要な効果を正確に記述するだけで、AIが完璧に実装してくれます。ポイントは、ただ「アニメーションを付けて」と言うのではなく、**具体的なアニメーション**について詳しく説明することです。

---

#### フォントの選択

デザインを瞬時に向上させるもう一つの重要な要素は、選択する**フォント**です。プロジェクトの雰囲気に合ったフォントを使用すると、アマチュアレベルからプロレベルへと瞬く間に引き上げることができます。

#### Google Fontsの活用

私たちのランディングページを例にとってみましょう。ヒーローセクションのメインテキストを変更したい場合、適切なフォントはどこで、どのように見つけたらよいでしょうか？

**Google Fonts**は最高の情報源です。様々な芸術的なスタイルを持つ広範なライブラリと、探しているものを正確に見つけるのに役立つ素晴らしいフィルターがあります。

例えば、私のヒーローセクションに最適なフォントが見つかりました。これを開いて「Get font」ボタンをクリックします。「Get embedded code」オプションを使用すると、プロジェクトに埋め込むコードが提供され、フォントがすぐに利用可能になります。

Cursorに戻り、フォントをインポートするために埋め込みコードを与え、ヒーローセクションのメイン見出しに適用するように指示します。ウェブサイトに戻ると、フォントが適用され、ウェブサイトが劇的に良くなったことがわかります。適切なタイポグラフィがいかに大きな違いを生むか、驚くばかりです。

---

#### レイアウトの指定

AIに対して**具体的に**指示する必要があることはよく言われますが、多くの人がこの点を日々見落としています。レイアウトの設計がその完璧な例です。

「アプリを作って」「サイトをレスポンシブにして」とだけ言うと、一応は機能しますが、完璧ではなく、バグが残ることがあります。代わりに、**正確なレイアウト**を指定してください。

例えば、私は「モバイルでは単一の列になる弁当レイアウトを作成する」と指示しました。レイアウトがどのように機能すべきかを意図的に指定し、その結果を示すためにファイルに入れました。

この弁当レイアウトを見てください。カードが完璧に配置されています。これをモバイル表示に切り替えると、カードがシームレスに単一の列に移行し、はるかに優れたユーザーエクスペリエンスが生まれます。

他にも指定して独自のアプリケーションに実装できるレイアウトの例をいくつかご紹介します。ウェブサイトやアプリをさらに美しくするための他のリソースへのリンクも残しておきますので、ぜひ確認してください。

最も重要なのは、これらの方法の少なくとも1つを試して、独自のアプリに実装することです。その違いに驚くことでしょう。

---

この動画は以上です。これらの方法が役立ったと感じたら、ぜひチャンネル登録ボタンを押してチャンネルをサポートしていただけると幸いです。このようなチュートリアルを作成し続ける上で本当に役立ちます。

ご視聴いただきありがとうございました。次回の動画でお会いしましょう！


Cursor AI を使ってウェブサイトを改善してみませんか？この Cursor AI チュートリアルでは、AI を使ったコーディングで驚くほどの成果を上げる方法を具体的に解説します。レイアウトからアニメーションまで、実際にどのように機能するのかを学びましょう。Cursor が AI コーディングをいかにスムーズにするかをご覧ください。

リンク:
https://reactbits.dev/
https://21st.dev/
https://tweakcn.com/
https://pro.magicui.design/?ref=muham...
https://pro.alignui.com/
https://bentogrids.com/
https://grainient.supply/freebies

このビデオでは、デザイン JSON を使ったデザインの複製から、TweakCN などのツールや React Bits などのプレミアムライブラリを使ったオリジナル UI の作成まで、Cursor AI を実際のウェブ開発に活用する方法について詳しく説明します。この Cursor AI チュートリアルでは、AI を使ったコーディングが単に速いだけでなく、プロフェッショナルな仕上がりになる理由を詳しく説明します。