ご依頼ありがとうございます。ご提示いただいた動画「Sub agents & Parallel tasks」の内容を文字起こしし、その内容を詳細に分析・解説いたします。

動画で紹介されているのは、Anthropic社のAIコーディングアシスタント**Claude Code**（主にCursorエディタ上で利用）の高度な機能を駆使して、UI（ユーザーインターフェース）デザインの試行錯誤（イテレーション）を劇的に高速化する、非常に実践的で革新的なワークフローです。

実際にこのワークフローを試す際に戸惑わないよう、具体的なコマンドや設定方法、そして重要な注意点などを詳細に補足しながら解説します。長文になりますが、一つ一つのステップを丁寧に追っていきましょう。

---

## 動画の概要：AIでUIデザインを10倍高速化する新ワークフロー

この動画の発表者は、Claude Codeのあまり知られていない「**サブエージェント（Sub-agents）**」と「**並列タスク（Parallel tasks）**」という機能を使い、一度に5つから10もの異なるUIデザイン案を同時に生成する「クラウドデザイナー」とも呼べるカスタム環境を構築した、と述べています。

この手法の鍵となるのは、以下の4つのコアコンセプトです。

1. **サブエージェントと並列タスク**: 複数のAIエージェントを同時に動かし、並行して作業させる。
    
2. **`claude.md`**: Claude Codeの挙動をカスタマイズするための設定ファイル。
    
3. **コマンド (Commands)**: よく使う一連の指示（プロンプト）を定型化し、再利用可能にする機能。
    
4. **Git Worktree**: 1つのプロジェクトで複数のバージョンを同時に編集するためのサンドボックス環境を構築するGitの機能。
    

これらのコンセプトを組み合わせることで、単純なHTMLのUIデザインから、Next.jsなどで作られた複雑な本番アプリケーションのUI改修まで、驚くほど効率的に行えるようになります。

---

### 第1部：ワークフローを支える4つのコアコンセプト

まずは、この革新的なワークフローを実現するための基本的な要素を一つずつ理解していきましょう。

#### 1. サブエージェントと並列タスク (Sub-agents & Parallel tasks)

これが最も中核的な機能です。通常、AIアシスタントには一度に一つのタスクしか依頼できません。しかし、Claude Codeでは、プロンプトで指示することにより、**複数の「サブエージェント」を起動し、それぞれに異なるタスクを並行して実行させることができます。**

**動画での具体例 (0:29〜):**

「to-doアプリのUIのバリエーションを実装するために、3つの並列エージェントを起動して」という主旨のプロンプトを入力します。

```
start a three parallel agent to implement variations of the to-do app UI
```

すると、Claude Codeは3つのタスクを同時に開始します。

- **タスク1:** ミニマリスト風のto-doアプリUIを実装
    
- **タスク2:** モダンなto-doアプリUIを実装
    
- **タスク3:** かんばん形式のto-doアプリUIを実装
    

**補足とポイント:**

- **利点:** UIデザインのように「複数の選択肢を比較検討したい」場合に絶大な効果を発揮します。デザイナーがFigmaで複数のアートボードをフォーク（複製）してバリエーションを作る作業を、AIが自動でやってくれるイメージです。
    
- **注意点:** 動画内でも言及されているように（0:57〜）、この方法は万能ではありません。複数のエージェントが同じファイルを同時に編集しようとすると、**マージコンフリクト**（コードの衝突）が発生する可能性があります。各エージェントは他のエージェントの作業内容を知らないためです。そのため、UIのバリエーション作成のように、互いの作業が独立しているタスクに向いています。
    

#### 2. `claude.md`：Claude Codeの挙動をカスタムする

`claude.md`は、プロジェクトのルートディレクトリに配置することで、そのプロジェクト内でのClaude Codeの挙動を細かく制御できる設定ファイルです。Cursorエディタの「Rules for AI」機能に相当します。

**動画での具体例 (4:07〜):**

1. プロジェクトのルートに`claude.md`という名前のファイルを作成します。
    
2. ファイル内に指示を書き込みます。例えば、以下のように書くと、Claude Codeの返答がすべて大文字になります。
    
    Markdown
    
    ```
    You always respond in all caps
    ```
    
3. さらに、UIデザインに特化したルールを追加することも可能です。
    
    Markdown
    
    ```
    # Internal UI Design System
    
    ## Colors
    - Primary: #1a73e8
    - Secondary: #e8f0fe
    - Text: #202124
    
    ## Fonts
    - Use 'Roboto', sans-serif for all text.
    
    ## Rules
    - When asked to build UI iterations, you must always create one single HTML file.
    - Do not create complex project structures with CSS or JS files separately unless specified.
    ```
    

**補足とポイント:**

- **使い方:** このファイルに、プロジェクトのコーディング規約、使用するライブラリ、デザインシステムのカラースキームやフォント、そしてAIエージェントへの特別な指示（「常に単一のHTMLファイルで出力せよ」など）を記述しておくことで、生成されるコードの品質と一貫性を高めることができます。
    
- **操作のヒント:** 新しいプロジェクトを開始する際に、まずこの`claude.md`を定義することで、AIとのやり取りがスムーズになります。
    

#### 3. コマンド機能：ワークフローのテンプレート化

頻繁に利用する一連のタスクや複雑なプロンプトを、短いコマンドとして事前定義しておける機能です。これにより、毎回長いプロンプトを入力する手間が省けます。

**動画での具体例 (4:54〜):**

1. プロジェクト内に`.claude/commands`というディレクトリを作成します。
    
2. その中に、コマンド名でMarkdownファイルを作成します（例: `joke.md`）。
    
3. ファイル内に、プロンプトのテンプレートを記述します。`{{arguments}}`という特殊な変数を使うことで、コマンド実行時に動的な情報を渡せます。
    
    **`joke.md` の内容:**
    
    Markdown
    
    ```
    Make a joke about {{arguments}}.
    Always end the joke with "a man eating chips".
    ```
    
4. エディタで`/`を入力するとコマンド候補が表示されるので、`/joke`を選択し、続けて引数（arguments）となるテキストを入力します。
    
    ```
    /joke AI coding
    ```
    
    すると、`{{arguments}}`の部分が `AI coding` に置き換えられたプロンプトが実行されます。
    

**さらに高度な使い方:**

コマンドには、`git status`のような**シェルコマンドを埋め込む**こともできます。これにより、タスク実行前に特定の状態を確認する、といった自動化が可能です。

**補足とポイント:**

- **ディレクトリ構造:** `.claude/commands`というフォルダ構造を正確に守る必要があります。
    
- **`{{arguments}}`の強力さ:** この変数は非常に柔軟で、単なる単語だけでなく、長い文章や指示も渡せます。AIが文脈を理解し、渡されたフリーテキストをよしなに解釈してくれます。これは従来のプログラムの引数とは異なる、非常に興味深い設計思想です。
    

#### 4. Git Worktree：安全な並列開発環境

`git worktree`は、Gitの標準機能の一つです。通常、Gitでは一度に一つのブランチしか作業できませんが、worktreeを使うと、**1つのリポジトリから複数のブランチを、それぞれ別のディレクトリに同時にチェックアウト**できます。これにより、各ブランチが独立したサンドボックス環境となり、互いに影響を与えることなく作業を進められます。

**動画での具体例 (9:45〜):**

Next.jsのような複雑なプロジェクトで、複数のUI改修案を並行して試したい場合にこの機能を使います。

**コマンド例:**

Bash

```
# "demo-branch" という名前の新しいブランチを作成し、
# その内容を "trees/demo-branch" という新しいディレクトリに展開する
git worktree add -b demo-branch trees/demo-branch
```

このコマンドを実行すると、`trees/demo-branch`というフォルダが作成され、その中にはプロジェクトの全ファイルがコピーされます。このフォルダは`demo-branch`ブランチに紐づいており、ここで加えた変更は元のプロジェクトの他のブランチには影響しません。

**補足とポイント:**

- **なぜ必要か:** Claude Codeの並列エージェントに、それぞれ別のworktree（作業ディレクトリ）を割り当てることで、前述のマージコンフリクトの問題を回避し、複雑なアプリケーションでも安全に並列UI開発ができるようになります。
    
- **注意点:** 各worktreeは、`node_modules`などの依存関係を個別にインストールする必要があります。そのため、worktreeを多用すると**ディスク容量をかなり消費します。**（動画でも13:41で言及）。不要になったworktreeはこまめに削除しましょう (`git worktree remove <path>`)。
    

---

### 第2部：実践的なUI開発ワークフロー

上記の4つのコンセプトを組み合わせた、具体的なワークフローを2つ紹介します。

#### ワークフロー1：単一HTMLファイルでの高速UIイテレーション (6:16〜)

Webサイトのデザインモックアップから、素早くHTMLのプロトタイプを複数パターン生成するワークフローです。

ステップ1: UIのインスピレーションを得る

Dribbbleなどのデザインサイトで、参考にしたいUIのスクリーンショットを保存します。

ステップ2: コマンドを作成し、デザインシステムを抽出する

まず、画像からデザイン情報を抜き出すためのコマンド (.claude/commands/ui/extract-design-system.md) を作成します。

Markdown

```
The user will provide an image URL or path.
Your task is to analyze the UI in the image.
Extract the following design system information:
- Color Palette (primary, secondary, accent, text colors)
- Typography (font families, sizes, weights)
- Layout Style (e.g., minimalist, brutalist, corporate)
Save the extracted information into a JSON file at `prd/design-system.json`.
```

このコマンドに画像のパスを渡して実行すると、AIが画像を分析し、`prd/design-system.json`というファイルに色やフォントの情報を書き出してくれます。

ステップ3: コマンドを作成し、UIバリエーションを並列生成する

次に、抽出したデザインシステムを元に、UIを並列生成するコマンド (.claude/commands/ui/iterate-design.md) を作成します。

Markdown

```
Analyze the `prd/design-system.json` file.
The user will provide a brief for a UI component (e.g., a modern to-do app).
Based on the design system and the user's brief, spin up 3 parallel sub-agents to implement the UI.
Each sub-agent should try a slightly different style (e.g., one with more animation, one more compact, etc.).
Each agent must output a single, self-contained HTML file into the `ui-iterations/` folder (e.g., `ui-1.html`, `ui-2.html`).
```

このコマンドに「モダンな電話用のto-doアプリ」といった指示を与えると、3つのサブエージェントが起動し、`ui-iterations`フォルダに3つの異なるHTMLファイルが同時に生成されます。

ステップ4: イテレーションを繰り返す

生成されたUIの中から気に入ったもの（例: ui-2.html）を選び、それをベースにさらに「ダークモードにしてみて」といった指示を出すことで、デザインをどんどん洗練させていくことができます。

#### ワークフロー2：本番プロジェクトでの並列UI改修 (11:18〜)

Next.jsなどで作られた、より複雑な本番用アプリケーションのUIを、複数のスタイルで同時に改修する、非常に高度なワークフローです。

ステップ1: すべてを自動化するマスターコマンドを作成する

このワークフローの心臓部となる、複数の処理をまとめたコマンド (.claude/commands/execute-parallel-agents.md) を作成します。このコマンドは内部で2つのステップを実行します。

Markdown

```
Based on the user's request (e.g., "try 3 versions of UI..."), perform the following steps:

## Step 1: Setup Git Worktrees
- For each UI variation requested, create a new git worktree.
- Use a clear naming convention, e.g., `trees/nerdy-style`, `trees/kids-style`.
- Run `pnpm install` in each new worktree to set up the dependencies.

## Step 2: Launch Parallel Sub-Agents
- After the worktrees are set up, launch parallel sub-agents.
- Assign each sub-agent to one of the worktree folders.
- Provide each agent with the specific task to modify the UI components according to the requested style (e.g., "modify the UI to have a nerdy style").
- The key files to modify are likely `app/page.tsx` and related component files.
```

ステップ2: コマンドを実行する

このマスターコマンドを使って、具体的な指示を出します。

```
/execute-parallel-agents try three versions of UI: one nerdy style, one kid style, and one gaming style
```

**ステップ3: 実行プロセス**

1. Claude Codeはまず、指示に従って3つの`git worktree`（`trees/nerdy`, `trees/kid`, `trees/gaming`）を自動で作成します。
    
2. 各ディレクトリで`pnpm install`を実行し、プロジェクトのセットアップを完了させます。
    
3. 次に、3つの並列サブエージェントを起動し、それぞれに「オタク風UI」「子供向けUI」「ゲーミング風UI」を実装するよう、個別のタスクを割り当てます。
    
4. 各エージェントは、割り当てられたディレクトリ内で、既存のコンポーネントファイルを変更していきます。
    

結果:

しばらく待つと、treesフォルダ内に3つの完全に独立したUI改修版が完成します。それぞれを起動してプレビューし、最も気に入ったものを採用して、元のブランチにマージすることができます。

---

### 第3部：未来のワークフロー：Superdesign.dev (14:05〜)

動画の最後には、発表者がこの並列処理のコンセプトをさらに発展させて開発した、**Superdesign.dev** というCursor拡張機能が紹介されています。

**これはClaude Codeの標準機能ではなく、応用例として紹介されているものです。**

- **機能:** 左側にチャットウィンドウ、右側に生成されたUIのプレビューが表示されます。
    
- **使い方:**
    
    1. 拡張機能をインストールし、AnthropicのAPIキーを設定します。
        
    2. 左側のチャットで「電卓のワイヤーフレームをデザインして」のようにプロンプトを入力します。
        
    3. AIエージェントが複数のUI案を並列で生成し、右側のキャンバスに表示します。
        
    4. 気に入ったデザインを選び、「これを元にハイファイなモックアップを作って」のようにフィードバックを与えて、さらにイテレーションを重ねます。
        
    5. 最終的に、実装に使いたいデザインのプロンプト（スタイル情報などを含む）をコピーし、Cursorにペーストして実際のWebアプリとしてコーディングさせることができます。
        
- **将来性:** 次のバージョンでは`git worktree`をサポートし、既存のプロダクションアプリのUIを直接このツール上でイテレーションできるようにすることを目指しているとのことです。
    

---

### まとめと、実際に試す際の重要ポイント

この動画で紹介された手法は、AIを単なるコード補完ツールとしてではなく、**デザインのアイデア出しからプロトタイピング、さらには本番実装の支援までを行うクリエイティブ・パートナー**として活用する、新しい開発の形を示唆しています。

実際にこれらのワークフローを試す際には、以下の点に注意してください。

1. **環境設定:**
    
    - **Cursor**のような、Claude Codeが統合されたエディタが必要です。
        
    - **Git**の基本的な知識、特に`git worktree`のコマンドに慣れておく必要があります。
        
    - Next.jsなどのプロジェクトを扱う場合は、**Node.js**と**pnpm**（またはnpm/yarn）が必要です。
        
2. **AIの不完全さ:**
    
    - 生成されるコードやデザインは常に完璧ではありません。最終的には人間の手による調整や修正が必要です。
        
    - プロンプトの書き方によって結果が大きく変わるため、試行錯誤が求められます。
        
3. **リソース管理:**
    
    - `git worktree`は非常に便利ですが、ディスク容量を大きく消費します。不要になったworktreeは`git worktree remove`コマンドでこまめに削除しましょう。
        
    - 並列タスクは、APIの利用制限（レートリミット）に影響される可能性があり、タスクの数によっては完了までに時間がかかることがあります。（動画でも12:58で言及）
        
4. **応用範囲:**
    
    - この手法はUIデザインに限りません。例えば、同じ仕様に対して「パフォーマンス重視」「可読性重視」「最小コード」といった異なる実装方針でコードを並列生成させる、といった応用も考えられます。
        

この解説が、動画の内容を深く理解し、ご自身の開発プロセスにこの強力な手法を取り入れるための一助となれば幸いです。