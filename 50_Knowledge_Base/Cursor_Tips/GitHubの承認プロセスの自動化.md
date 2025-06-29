こんにちは。ご視聴されたYouTube動画の内容について、専門的な知識がない方にも分かりやすく、そして後からご自身で試せるように「再現性」を重視して解説しますね。

この解説を保存しておけば、手順書として使いながら作業を進めることができます。

---

### この動画が解決しようとしている「悩み」とは？

まず、この動画が解決しようとしている「悩み」を簡単に説明します。

**一言でいうと、「AIに手伝ってもらって作ったプログラムの修正を、チームのルールが原因で、自分自身で最終決定（承認）できなくて面倒くさい！」という問題です。**

もう少し詳しく見てみましょう。

- **チーム開発のルール:** 多くの開発チームでは、大事なプログラム（例えば、`main`ブランチという本番用の設計図）が簡単に書き換えられないように、「変更を加えるときは、必ず他の誰かのOKをもらってください」というルール（**ブランチプロテクションルール**）を設定しています。
    
- **AIとの開発:** 最近、ClaudeのようなAIに相談しながらプログラムを作ることが増えました。これは実質的にAIと2人で内容を確認しながら進めている（ペアプログラミングのような）状態です。
    
- **問題発生:** AIとしっかりレビューして完成したコードでも、いざチームのルールに沿って「この変更お願いします！」と提案（**プルリクエスト**）を出すと、提案者である自分自身ではOK（**承認**）を出せません。他のチームメンバーに「AIと確認済みなので、形だけでいいのでOKください」とお願いする必要があり、お互いにとって少し無駄な時間が発生してしまいます。
    

この「形式的な承認待ち」というボトルネックを解消しよう、というのがこの動画のテーマです。

### どうやって解決するの？【核心アイデア】

解決策のアイデアはとてもシンプルです。

**「自分の代わりにプルリクエストを出してくれる、もう一人の自分（ボット）を作ろう！」**

というものです。

動画では、この「もう一人の自分」の役割を**GitHub Apps**という仕組みを使って実現しています。

流れは以下のようになります。

1. **あなた:** AIと一緒にコードを作成し、特定の名前（例：`ai/機能名`）を付けた作業用のコピー（**ブランチ**）に保存します。
    
2. **見張り役 (GitHub Actions):** 「`ai/`から始まる名前のブランチが更新されたぞ！」と検知して、自動的に動き出します。
    
3. **分身ロボット (GitHub App):** 見張り役から指令を受け、あなたが作ったコード変更を、**ロボット自身の名前で**「こんな変更はどうですか？」と提案（プルリクエストを作成）してくれます。
    
4. **あなた:** ロボットが提案してくれたので、あなたは「提案者」ではなく「確認者」の立場になります。そのため、自分自身で「OK！（承認）」を出して、変更を本番用の設計図に反映（**マージ**）することができるようになります。
    

これで、他の人に形式的なレビューをお願いする手間が省ける、というわけです。

---

### 実際にやってみよう！具体的な手順（完全再現ガイド）

ここからは、あなたが後で動画の内容を再現できるように、具体的な手順を一つずつ解説します。この通りに進めれば、同じ仕組みを作ることができます。

#### ステップ1：分身ロボット（GitHub App）を作る

まず、あなたの代わりに働いてくれるロボット（GitHub App）自体を作成します。

1. GitHubの右上の自分のアイコンをクリックし、`Settings` を選択します。
    
2. 左側のメニューを下にスクロールし、`Developer settings` をクリックします。
    
3. 左側のメニューで `GitHub Apps` を選択し、右上の `New GitHub App` ボタンを押します。
    
4. **登録情報を入力します。**
    
    - `GitHub App name`: ロボットの名前を決めます。世界で一つだけの名前である必要があります。（例：`yourname-ai-agent`）
        
    - `Homepage URL`: あなたのウェブサイトや、会社のURLなどを入力します。（例：`https://github.com/`）
        
    - `Webhook`: `Active` のチェックを外します。今回は使いません。
        
5. **ロボットに与える権限（Permissions）を設定します。**
    
    - `Repository permissions` の項目を探します。
        
    - `Contents` を見つけ、右側のドロップダウンを `Read-only` に設定します。（コードを読み取るため）
        
    - `Pull requests` を見つけ、右側のドロップダウンを `Read and write` に設定します。（プルリクエストを作成・編集するため）
        
6. **ロボットを使える範囲（Install this GitHub App）を設定します。**
    
    - `Only on this account` を選択するのが一般的です。これであなたのアカウント内でのみ、このロボットが使えるようになります。
        
7. 一番下にある `Create GitHub App` ボタンを押して、ロボットの作成は完了です。
    

#### ステップ2：ロボットの「秘密の合鍵」を作り、リポジトリに設定する

ロボットがあなたのアカウントで安全に動くためには、「秘密の合鍵」が必要です。

1. **秘密の合鍵（Private Key）を生成する**
    
    - ロボットの管理画面を下にスクロールすると、`Private keys` という項目があります。
        
    - `Generate a private key` ボタンを押すと、`.pem` という拡張子のファイルがダウンロードされます。これは**絶対に他人に見せたり、失くしたりしないように大切に保管してください。**
        
2. **ロボットをリポジトリにインストールする**
    
    - 左側のメニューから `Install App` を選択します。
        
    - あなたのアイコンの横にある `Install` ボタンを押します。
        
    - 「どのリポジトリでこのロボットを使いますか？」と聞かれるので、`Only select repositories` を選び、今回この仕組みを使いたいリポジトリ（動画では `claude-code-todo-app`）を選択します。
        
    - `Install` ボタンを押します。
        
3. **リポジトリの「金庫」に合鍵情報を登録する**
    
    - 先ほどロボットをインストールしたリポジトリのページに移動します。
        
    - `Settings` タブ > 左メニューの `Secrets and variables` > `Actions` を選択します。
        
    - `New repository secret` ボタンを押して、2つの秘密情報を登録します。
        
        - **1つ目：App ID**
            
            - `Name`: `APP_ID` と入力します。
                
            - `Secret`: ロボットの管理画面（`Developer settings` > `GitHub Apps` > 作成したAppを選択）にある `App ID` の番号をコピーして貼り付けます。
                
            - `Add secret` を押します。
                
        - **2つ目：秘密の合鍵**
            
            - `Name`: `APP_PRIVATE_KEY` と入力します。
                
            - `Secret`: 先ほどダウンロードした `.pem` ファイルの中身を全てコピーして貼り付けます。（ファイルを開き、`-----BEGIN RSA PRIVATE KEY-----` から `-----END RSA PRIVATE KEY-----` まで全てです）
                
            - `Add secret` を押します。
                

これで、リポジトリがロボットと安全に通信するための準備が整いました。

#### ステップ3：ロボットへの「お願いごと（ワークフロー）」を記述する

最後に、どんな時に、何をしてほしいのかを具体的に指示する「設定ファイル」を作成します。

1. **リポジトリの設定変更**
    
    - リポジトリの `Settings` タブ > 左メニューの `Actions` > `General` を選択します。
        
    - 下の方にスクロールし、`Workflow permissions` という項目を見つけます。
        
    - `Allow GitHub Actions to create and approve pull requests` という選択肢にチェックを入れて `Save` します。これにより、ロボットがプルリクエストを作れるようになります。
        
2. **ワークフローファイルを作成する**
    
    - リポジトリのコード編集画面に行き、以下の場所に新しいファイルを作成します。
        
    - ディレクトリ（フォルダ）: `.github/workflows/`
        
    - ファイル名: `auto_pr.yml` （名前は自由です）
        
3. **ファイルに以下の内容をコピー＆ペーストする**
    
    YAML
    
    ```
    # .github/workflows/auto_pr.yml
    
    name: 'AI-Generated PR'
    
    # どのブランチがプッシュされたら動くかを指定
    # 'ai/' で始まる名前のブランチが対象
    on:
      push:
        branches:
          - 'ai/**'
    
    # このワークフローに必要な権限
    permissions:
      contents: read
      pull-requests: write
    
    jobs:
      create-pr:
        runs-on: ubuntu-latest
        steps:
          # ステップ1: GitHub Appとして認証するためのトークン（一時的なパスワード）を取得する
          - name: Get GitHub App Token
            id: get_token
            uses: peter-murray/workflow-application-token-action@v3
            with:
              application_id: ${{ secrets.APP_ID }}
              application_private_key: ${{ secrets.APP_PRIVATE_KEY }}
    
          # ステップ2: コードをチェックアウト（ダウンロード）する
          # 認証トークンを使って、プライベートリポジトリにもアクセスできるようにする
          - name: Checkout
            uses: actions/checkout@v4
            with:
              token: ${{ steps.get_token.outputs.token }}
    
          # ステップ3: すでにこのブランチのプルリクエストが存在するかチェック
          - name: Check Existing PR
            id: check_pr
            run: |
              # 現在のブランチ名を取得
              BRANCH_NAME=${{ github.ref_name }}
              # GitHubのAPIを使って、このブランチを元にしたオープンなPRがあるか検索
              # 結果（PRの数）を GITHUB_OUTPUT に保存
              PR_COUNT=$(gh pr list --head "$BRANCH_NAME" --state open --json number --jq 'length')
              echo "pr_exists=$( [ $PR_COUNT -gt 0 ] && echo 'true' || echo 'false' )" >> $GITHUB_OUTPUT
            env:
              GH_TOKEN: ${{ steps.get_token.outputs.token }}
    
          # ステップ4: もしプルリクエストがまだ存在しない場合のみ、新規作成する
          # if: steps.check_pr.outputs.pr_exists == 'false' という条件
          - name: Create Pull Request
            if: steps.check_pr.outputs.pr_exists == 'false'
            run: |
              # 現在のブランチ名を取得
              BRANCH_NAME=${{ github.ref_name }}
              # gh pr create コマンドでプルリクエストを作成
              # --title: タイトル
              # --body: 本文
              # --base: マージ先のブランチ（通常はmain）
              gh pr create \
                --title "AI Generated: ${BRANCH_NAME}" \
                --body "This PR was auto-generated by GitHub Actions for branch: ${BRANCH_NAME}" \
                --base main
            env:
              GH_TOKEN: ${{ steps.get_token.outputs.token }}
    
    ```
    

これで全ての準備が完了です！

`ai/test-feature` のような名前のブランチを作成して、何か変更を加えてプッシュ（アップロード）してみてください。数分後に、自動でロボットがプルリクエストを作成してくれるはずです。

### この方法を使う上での大事なルール

動画の最後で触れられていたように、この方法は非常に便利ですが「諸刃の剣」でもあります。**何でもかんでも自分で承認するのは危険**です。導入する前に、チームで「どんな時に使って良いか」のルールを決めましょう。

【使っても良さそうな例】

✅ ドキュメントのちょっとした修正

✅ 他に影響が少ない設定ファイルの変更

✅ AIと十分にレビューを重ねた、小規模で単純な機能追加

✅ テストコードの追加や修正

✅ プログラムの動作に影響しないリファクタリング（コードの整理）

【使うべきではない（他の人のレビューをもらうべき）例】

❌ アプリ全体の設計（アーキテクチャ）に関わる大きな変更

❌ セキュリティに関わる実装

❌ 外部サービスとの連携部分

❌ データベースの構造（スキーマ）の変更

❌ ビジネスの根幹に関わる重要なロジックの変更

---

### まとめ

- **悩み:** AIと作ったコードを自分で承認できず、形式的なレビュー依頼が面倒。
    
- **解決策:** 「分身ロボット(GitHub App)」にプルリクエストを代わりに作ってもらう。
    
- **方法:** ①GitHub Appを作成、②秘密鍵を設定、③GitHub Actionsで自動化のルールを記述する。
    
- **注意点:** 便利な方法だが、乱用は危険。チームで「いつ使うか」のルールを決めることが非常に重要。
    

この解説が、あなたの開発効率を上げる一助となれば幸いです。