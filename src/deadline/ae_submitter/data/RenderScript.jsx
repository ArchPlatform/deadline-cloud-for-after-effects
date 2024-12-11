function __generateRenderScriptTemplate(compParameterName) {
    return (
"try {\n" +
"\n" +
"    if (-not $env:AERENDER_EXECUTABLE) { $env:AERENDER_EXECUTABLE = 'aerender.exe' }\n" +
"\n" +
"    Write-Host \"Running: $env:AERENDER_EXECUTABLE -project `\"{{Param.AfterEffectsProjectFile}}`\" -comp `\"" + compParameterName + "`\" -s {{Task.Param.FrameChunkStart}} -e {{Task.Param.FrameChunkEnd}}\"\n" +
"\n" +
"    $StartInfo = New-Object System.Diagnostics.ProcessStartInfo -Property @{\n" +
"        FileName = $env:AERENDER_EXECUTABLE\n" +
"        Arguments = '-project \"{{Param.AfterEffectsProjectFile}}\" -comp \"" + compParameterName + "\" -s {{Task.Param.FrameChunkStart}} -e {{Task.Param.FrameChunkEnd}}'\n" +
"        UseShellExecute = $false\n" +
"        RedirectStandardOutput = $true\n" +
"        RedirectStandardError = $true\n" +
"    }\n" +
"\n" +
"    $Process = New-Object System.Diagnostics.Process\n" +
"    $Process.StartInfo = $StartInfo\n" +
"\n" +
"    $global:RunError = \"\"\n" +
"\n" +
"    $OutEvent = Register-ObjectEvent -Action {\n" +
"        Write-Host $Event.SourceEventArgs.Data\n" +
"        If($Event.SourceEventArgs.Data -match \"Error\") {\n" +
"            Write-Host \"Error: $($Event.SourceEventArgs.Data)\" -ForegroundColor Red\n" +
"            Set-Variable -Name RunError -Value $Event.SourceEventArgs.Data -Scope Global\n" +
"            Throw ( New-Object System.Exception( \"Runtime Exception\", $Event.SourceEventArgs.Data ) )\n" +
"        }\n" +
"    } -InputObject $Process -EventName OutputDataReceived\n" +
"\n" +
"    $ErrEvent = Register-ObjectEvent -Action {\n" +
"        Write-Host $Event.SourceEventArgs.Data\n" +
"    } -InputObject $Process -EventName ErrorDataReceived\n" +
"\n" +
"    # Start process\n" +
"    [void]$Process.Start()\n" +
"\n" +
"    # Begin reading stdin\\stdout\n" +
"    $Process.BeginOutputReadLine()\n" +
"    $Process.BeginErrorReadLine()\n" +
"\n" +
"\n" +
"    while (!$Process.HasExited) {}\n" +
"\n" +
"    # Unregister events\n" +
"    $OutEvent.Name, $ErrEvent.Name |\n" +
"        ForEach-Object {Unregister-Event -SourceIdentifier $_}\n" +
"\n" +
"\n" +
"    if ($global:RunError -ne \"\") {\n" +
"        Write-Host \"Error Detected: $global:RunError\" -ForegroundColor Red\n" +
"        exit 1\n" +
"    }\n" +
"    if ($Process.ExitCode -ne 0) {\n" +
"        Write-Host \"Return code: $Process.ExitCode\" -ForegroundColor Red\n" +
"        exit 1\n" +
"    }\n" +
"\n" +
"    Write-Host \"aerender succeeded\" -ForegroundColor Green\n" +
"    exit 0\n" +
"\n" +
"} catch {\n" +
"    Write-Host \"Error caught\"\n" +
"    Write-Host $_.Exception.Message -ForegroundColor Red\n" +
"    exit 1\n" +
"}\n"
    )
}

dcRenderScript = {
    "generateRenderCommand": __generateRenderScriptTemplate,
};
