$node = (Get-ChildItem -Path "$env:LOCALAPPDATA\OpenAI\Codex\runtimes\cua_node" -Filter node.exe -Recurse | Select-Object -First 1).FullName
Write-Host "Using Node: $node"
& $node ./node_modules/vite/bin/vite.js build
