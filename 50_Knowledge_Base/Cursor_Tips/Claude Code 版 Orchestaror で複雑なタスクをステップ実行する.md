---
title: "Claude Code 版 Orchestaror で複雑なタスクをステップ実行する"
source: "https://zenn.dev/mizchi/articles/claude-code-orchestrator"
author:
  - "[[Zenn]]"
published: 2025-06-12
created: 2025-06-27
description:
tags:
  - "clippings"
---
330

152[tech](https://zenn.dev/tech-or-idea)

## tl;dr

- Roo Orchestrator の Claude Code 版を作ってみた
- Roo は並列タスク未対応だが、 Claude Code の Task の並列実行ができる

## はじめに

普段から Roo Orchestrator を愛用していて、その Claude 版が欲しかった。

Roo Orchestrator はタスクを段階的に分解して、個別にサブタスクに分解する。サブタスクは独立したセッションとして動き、タスク完了後は親にそのサマリを返す。

これはかなり効率的に動く。場合によるが、今までだと $6 かかっていたようなタスクが、$1 未満にコンテキストを圧縮できていた。動作も速い。

今回は、`.claude/commands` ディレクトリを使って、複雑なタスクを効率的に分解・実行する Orchestrator プロンプトを作成した。

## 事前知識: Task Tool と.claude/commands の仕組み

Claude Code はサブタスク分割に、チェックリスト生成と Task ツールという似たような仕組みがある。

これは自身を MCP サーバーとして起動し、親からタスクを受け取る。

また、Claude Code では、プロジェクトごとにカスタムコマンドを定義できる。`.claude/commands/*.md ` に Markdown ファイルを配置すると、それらがコマンドとして利用可能になる。

```
.claude/
└── commands/
    ├── orchestrator.md      # 複雑なタスクの分解実行
    └── commit-with-check.md # テスト後のコミット
```

コマンドは `/project:コマンド名` の形式で実行できる。

例：

- `/project:orchestrator analyze test lint and commit`
- `/project:commit-with-check`

## project:orchestrator コマンド

Roo の プロンプトを食わせて、 かつ Task を使うように指示して、自身に効くようなプロンプトを生成させた。

.claude/commands/orchestrator.md

```md
Initial Analysis
```

もしかしたら冗長かも。削れそうではあるが、オーケストレーターはコンテキストウィンドウに余裕があるので、長くても良さそう。

## 実行例：TypeScript MCP プロジェクトでの活用

ここで実験していた。

### 実行コマンド

```bash
# 初期プロンプト
/project:orchestrator analyze test lint and commit

● I'll help you analyze, test, lint, and commit your TypeScript MCP project. Let me break
  this down into sequential steps with parallel subtasks.
  ⎿  ☐ Step 1: Initial Analysis - Understand project structure and test/lint setup
     ☐ Step 2: Quality Checks - Run tests, linting, and check git status
     ☐ Step 3: Fix Issues - Address any errors found in Step 2
     ☐ Step 4: Final Validation and Commit

● Step 1: Initial Analysis
  ⎿  ☐ Step 1: Initial Analysis - Understand project structure and test/lint setup
     ☐ Step 2: Quality Checks - Run tests, linting, and check git status
     ☐ Step 3: Fix Issues - Address any errors found in Step 2
     ☐ Step 4: Final Validation and Commit

● Task(Analyze project structure)
  ⎿  Done (7 tool uses · 17.8k tokens · 44.2s)
  ⎿  ☒ Step 1: Initial Analysis - Understand project structure and test/lint setup
     ☐ Step 2: Quality Checks - Run tests, linting, and check git status
     ☐ Step 3: Fix Issues - Address any errors found in Step 2
     ☐ Step 4: Final Validation and Commit

# ... 中間状態

● Step 2: Quality Checks (並列実行)

● Task(Run tests)
  ⎿  Done (1 tool use · 16.4k tokens · 30s)

● Task(Run linting and type checking)
  ⎿  Done (2 tool uses · 14.8k tokens · 26.1s)

● Task(Check git status)
  ⎿  Done (6 tool uses · 15.8k tokens · 37.3s)
  ⎿  ☒ Step 1: Initial Analysis - Understand project structure and test/lint setup
     ☒ Step 2: Quality Checks - Run tests, linting, and check git status
     ☐ Step 3: Fix Issues - Address any errors found in Step 2
     ☐ Fix ESLint errors in lspGetDiagnostics.ts (2 errors)
     ☐ Fix ESLint errors in lspGetHover.ts (4 errors)
     ☐ Fix ESLint error in tsMoveDirectory.ts (unbound method)
     ☐ Fix TypeScript error in tsMoveDirectory.ts (typeof Project)
     ☐ Step 4: Final Validation and Commit

# ...最終的な状態

● すべての修正が完了し、テストとリンティングが正常に通過しました！
● Bash(git add -A && git commit -m "fix: resolve linting and type errors in LSP and
      TypeScript tools…)
  ⎿  [main 282a888] fix: resolve linting and type errors in LSP and TypeScript tools
      5 files changed, 115 insertions(+), 20 deletions(-)
      create mode 100644 .claude/commands/commit-with-check.md
      create mode 100644 .claude/commands/orchestrator.md
  ⎿  ☒ Step 1: Initial Analysis - Understand project structure and test/lint setup
     ☒ Step 2: Quality Checks - Run tests, linting, and check git status
     ☒ Fix ESLint errors in lspGetDiagnostics.ts (2 errors)
     ☒ Fix ESLint errors in lspGetHover.ts (4 errors)
     ☒ Fix ESLint error in tsMoveDirectory.ts (unbound method)
     ☒ Fix TypeScript error in tsMoveDirectory.ts (typeof Project)
     ☒ Step 3: Fix Issues - Address any errors found in Step 2
     ☒ Step 4: Final Validation and Commit
```

## おわり

何パターンか試したが、結果的に効いたのはこれらの指示

- 最初に大雑把にコードを調べ、サブタスクの分割とステップを計画する
- サブタスクの実行ステップ内は並列化する
- ステップごとに、一つ前のタスクの実行結果から現在のサブタスク計画が妥当か再考する
	- そのままだと計画が破綻した時に手戻りが大きい。要はアジャイルっぽくする

今回の例では、「分析 → テスト → 修正 → コミット」という一連の作業を、構造化された方法で自動実行できた。

まあ、Roo に引きずられて Task の活用方法にはもっといい方法がある気がするんだけど、一旦これでいく。

330

152