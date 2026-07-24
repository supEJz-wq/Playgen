export default function PipelineCommandPreview({
  framework,
  language,
  testSuites,
  executionOptions,
  cacheConfig,
  matrixConfig,
}) {
  const fw = framework || 'playwright'
  const lang = language || 'JavaScript'

  const commands = []

  if (fw === 'playwright') {
    commands.push(
      { cmd: 'npm init playwright@latest', desc: 'Initialize Playwright project', category: 'Setup' },
      { cmd: 'npm install', desc: 'Install project dependencies', category: 'Dependencies' },
      { cmd: 'npx playwright install --with-deps', desc: 'Install Playwright browsers with system dependencies', category: 'Setup' },
    )

    const activeSuites = (testSuites || []).filter((s) => s.enabled && s.tags && s.tags.length > 0)
    if (activeSuites.length > 0) {
      activeSuites.forEach((suite) => {
        if (suite.tags && suite.tags.length > 0) {
          commands.push({ cmd: `npx playwright test --grep "${suite.tags.join(' ')}"`, desc: `Run ${suite.name}`, category: 'Test Execution' })
        }
        if (suite.files) {
          suite.files.forEach((file) => {
            commands.push({ cmd: `npx playwright test ${file}`, desc: `Run ${file}`, category: 'Test Execution' })
          })
        }
      })
    } else {
      commands.push({ cmd: 'npx playwright test', desc: 'Run all tests', category: 'Test Execution' })
    }

    if (executionOptions?.mode === 'parallel' && executionOptions?.workers > 1) {
      commands.push({ cmd: `npx playwright test --workers=${executionOptions.workers}`, desc: 'Run tests with parallel workers', category: 'Test Execution' })
    }
    if (executionOptions?.slowMo > 0) {
      commands.push({ cmd: `npx playwright test --slow-mo=${executionOptions.slowMo}`, desc: 'Run tests with slow motion', category: 'Test Execution' })
    }
    if (executionOptions?.retries > 0) {
      commands.push({ cmd: `npx playwright test --retries=${executionOptions.retries}`, desc: 'Run tests with retry', category: 'Test Execution' })
    }
  } else if (fw === 'selenium') {
    commands.push(
      { cmd: langCmd(lang, 'install'), desc: 'Install dependencies', category: 'Dependencies' },
      { cmd: langCmd(lang, 'build'), desc: 'Build project', category: 'Build' },
      { cmd: langCmd(lang, 'test'), desc: 'Run Selenium tests', category: 'Test Execution' },
    )
  } else if (fw === 'appium') {
    commands.push(
      { cmd: 'npm install -g appium', desc: 'Install Appium globally', category: 'Setup' },
      { cmd: langCmd(lang, 'install'), desc: 'Install project dependencies', category: 'Dependencies' },
      { cmd: 'appium driver install uiautomator2', desc: 'Install Android driver', category: 'Setup' },
      { cmd: 'appium &', desc: 'Start Appium server', category: 'Setup' },
      { cmd: langCmd(lang, 'test'), desc: 'Run Appium tests', category: 'Test Execution' },
    )
  }

  if (cacheConfig?.packageManager) {
    commands.push({ cmd: cacheCmd(cacheConfig.packageManager), desc: `Cache ${cacheConfig.packageManager} dependencies`, category: 'Caching' })
  }

  if (matrixConfig?.browsers?.length > 0 || matrixConfig?.os?.length > 0) {
    const browsersList = matrixConfig.browsers || []
    const osList = matrixConfig.os || []
    browsersList.forEach((b) => {
      commands.push({ cmd: `npx playwright test --project=${b}`, desc: `Run tests on ${b}`, category: 'Matrix' })
    })
    osList.forEach((o) => {
      commands.push({ cmd: `# Matrix OS: ${o}`, desc: `Run tests on ${o}`, category: 'Matrix' })
    })
  }

  const categories = [...new Set(commands.map((c) => c.category))]

  return (
    <>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Generated Commands</h4>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-2">{cat}</div>
            <div className="space-y-1">
              {commands.filter((c) => c.category === cat).map((c, i) => (
                <div key={i} className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-950 p-2.5 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-mono text-[11px] leading-relaxed">$ {c.cmd}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(c.cmd)}
                      className="shrink-0 ml-auto opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                      title="Copy command"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-slate-400 hover:text-white">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-5.5a1.5 1.5 0 01-1.5-1.5v-1.17l1.5 1.5V16.5a.5.5 0 00.5.5h5.5a.5.5 0 00.5-.5V6.622a.5.5 0 00-.146-.354l-3.122-3.12a.5.5 0 00-.354-.146H8.5a.5.5 0 00-.5.5v2.25l-1.5-1.5V3.5z" />
                        <path d="M2.5 6.5A1.5 1.5 0 014 5h5.5a1.5 1.5 0 011.5 1.5v10A1.5 1.5 0 019.5 18H4a1.5 1.5 0 01-1.5-1.5v-10z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function langCmd(lang, type) {
  const cmds = {
    JavaScript: { install: 'npm install', build: 'npm run build', test: 'npx mocha --timeout 30000' },
    TypeScript: { install: 'npm install', build: 'npm run build', test: 'npx playwright test' },
    Java: { install: 'mvn clean install -DskipTests', build: 'mvn compile', test: 'mvn test' },
    Python: { install: 'pip install -r requirements.txt', build: 'python -m compileall .', test: 'pytest -v' },
    'C#': { install: 'dotnet restore', build: 'dotnet build', test: 'dotnet test' },
  }
  return cmds[lang]?.[type] || 'npm test'
}

function cacheCmd(manager) {
  const cmds = {
    npm: 'npm cache verify',
    maven: 'mvn dependency:resolve -DskipTests',
    gradle: 'gradle build --build-cache',
    pip: 'pip cache info',
    nuget: 'dotnet nuget locals all --clear',
  }
  return cmds[manager] || '# Enable caching'
}
