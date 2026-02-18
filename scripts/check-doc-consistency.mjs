import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const docsRoot = path.join(projectRoot, 'docs')

const configFiles = [
  'docs/.vitepress/config/zh.ts',
  'docs/.vitepress/config/en.ts',
  'docs/.vitepress/config/ja.ts',
  'docs/.vitepress/config/ko.ts',
]

const bannedPatterns = [
  {
    regex: /src\/layouts\//,
    hint: 'Use src/components/Layout/ instead of src/layouts/',
  },
  {
    regex: /@\/layouts\//,
    hint: 'Use @/components/Layout/ instead of @/layouts/',
  },
  {
    regex: /src\/views\/organization\//,
    hint: 'Use actual paths under src/views/system/ and src/views/examples/',
  },
]

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function existsDocLink(link) {
  if (!link || link.startsWith('http://') || link.startsWith('https://')) {
    return true
  }

  const clean = link.split('#')[0]
  if (!clean) {
    return true
  }

  if (clean === '/') {
    return fs.existsSync(path.join(docsRoot, 'index.md'))
  }

  const rel = clean.replace(/^\//, '')
  const mdPath = path.join(docsRoot, `${rel}.md`)
  const indexPath = path.join(docsRoot, rel, 'index.md')
  return fs.existsSync(mdPath) || fs.existsSync(indexPath)
}

function collectNavLinkIssues() {
  const issues = []
  const linkPattern = /link:\s*'([^']+)'/g

  for (const relPath of configFiles) {
    const absPath = path.join(projectRoot, relPath)
    const content = readText(absPath)
    let match

    while ((match = linkPattern.exec(content)) !== null) {
      const link = match[1]
      if (existsDocLink(link)) {
        continue
      }

      issues.push({
        type: 'missing-link-target',
        file: relPath,
        link,
      })
    }
  }

  return issues
}

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function collectPatternIssues() {
  const issues = []
  const files = walkMarkdownFiles(docsRoot)

  for (const absPath of files) {
    const relPath = path.relative(projectRoot, absPath)
    const lines = readText(absPath).split('\n')

    lines.forEach((line, index) => {
      for (const rule of bannedPatterns) {
        if (!rule.regex.test(line)) {
          continue
        }

        issues.push({
          type: 'banned-pattern',
          file: relPath,
          line: index + 1,
          content: line.trim(),
          hint: rule.hint,
        })
      }
    })
  }

  return issues
}

function printIssues(issues) {
  for (const issue of issues) {
    if (issue.type === 'missing-link-target') {
      console.error(`- [link] ${issue.file} -> ${issue.link}`)
      continue
    }

    if (issue.type === 'banned-pattern') {
      console.error(`- [path] ${issue.file}:${issue.line}`)
      console.error(`  ${issue.content}`)
      console.error(`  Hint: ${issue.hint}`)
    }
  }
}

const allIssues = [
  ...collectNavLinkIssues(),
  ...collectPatternIssues(),
]

if (allIssues.length > 0) {
  console.error(`Found ${allIssues.length} documentation consistency issue(s):`)
  printIssues(allIssues)
  process.exit(1)
}

console.log('Documentation consistency check passed.')
