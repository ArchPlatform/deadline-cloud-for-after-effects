function __generateEnvironmentVariableDefault(environmentVarName, environmentVarDefault) {
    /**
     * Generates a Powershell snippet that will set an environment variable to a default value if not already defined.
     * @param {string} environmentVarName: Name of the environment variable that we are working with
     * @param {string} environmentVarDefault: Default value to set the environment variable to if not defined
     */
    return (
        "if (-not $env:" + environmentVarName + ") { $env:" + environmentVarName + " = '" + environmentVarDefault + "' }\n"
    )
}

function __generateContainingFolderExists(filepath) {
    /**
     * Generates a Powershell snippet that will ensure the containing folder of a passed filepath exists and create it if it does not.
     * @param {string} filepath: A filepath that needs it's containing folder created
     */
    return (
        "$filepath = \"" + filepath + "\"\n" +
        "Write-Host \"Output path: $filepath\"\n" +
        "$outputFolder = Split-Path -Path $filepath -Parent\n" +
        "if (-not (Test-Path $outputFolder)) { Write-Host \"Creating Folder: $outputFolder\"; New-Item -Path $outputFolder -ItemType \"directory\" -Force }\n" +
        "Write-Host \"Moving to '$outputFolder'\"\n" +
        "Set-Location -Path \"$outputFolder\"\n"
    )
}

function __generateSetLocation(folder) {
    /**
     * Generates a Powershell snippet that will cd to the specified folder.
     * @param {string} folder: A folder that should be cd'd to
     */
    return (
        "Write-Host \"Moving to '" + folder + "'\"\n" +
        "Set-Location -Path \"" + folder + "\"\n"
    )
}

function __generateTryCatchWrapper(code, noExit) {
    /**
     * Generates a Powershell snippet that will wrap the passed code in a try/catch and print any exceptions before exiting 1.
     * @param {string} code: Powershell code that should be wrapped in a try/catch.
     * @param {boolean} noExit: If passed, the code will not exit when it catches an exception.
     */
    if (noExit !== undefined) {

    }
    var snippet = (
"try {\n" +
    code +
"} catch {\n" +
"    Write-Host \"Error caught\"\n" +
"    Write-Host $_.Exception.Message -ForegroundColor Red\n" +
"}\n"
    )
    if (noExit !== undefined && noExit === true) {
        snippet = snippet.replace("}\n", "    exit 1\n" + "}\n")
    }
    return snippet
}

function __generateProcessWrapper(executableName, arguments, errorHandlers) {
    /**
     * Generates a Powershell snippet that will execute the passed executableName and arguments.
     * This execution has stdout and stderr event handlers that will parse stdout and stderr.
     * Any passed errorHandlers will be injected into the stdout handler to catch errors and stop the process if
     *  matched.
     * @param {string} executableName: Name of the executable to be run.
     * @param {string} arguments: string argument list to be passed to the executableNcame.
     * @param {Array[string]} errorHandlers: Optional array of strings that are used as Powershell matches to check for
     *                                       errors in stdout.
     */
    if (errorHandlers === undefined) {
        errorHandlers = [];
    }
    var errorHandlerCode = ""
    for (var i = 0; i < errorHandlers.length; i++) {
        var handler = errorHandlers[i]
        errorHandlerCode += (
"        If($Event.SourceEventArgs.Data -match \"" + handler + "\") {\n" +
"            Write-Host \"Error caught: $($Event.SourceEventArgs.Data)\" -ForegroundColor Red\n" +
"            Set-Variable -Name RunError -Value $Event.SourceEventArgs.Data -Scope Global\n" +
"            Throw ( New-Object System.Exception( \"Runtime Exception\", $Event.SourceEventArgs.Data ) )\n" +
"        }\n"
        )
    }
    return (
"$executable=\"" + executableName + "\"\n" +
"$args=\"" + arguments + "\"\n" +
"Write-Host \"Running: $executable $args\"\n" +
"$StartInfo = New-Object System.Diagnostics.ProcessStartInfo -Property @{\n" +
"    FileName = $executable\n" +
"    Arguments = $args\n" +
"    UseShellExecute = $false\n" +
"    RedirectStandardOutput = $true\n" +
"    RedirectStandardError = $true\n" +
"}\n" +
"$Process = New-Object System.Diagnostics.Process\n" +
"$Process.StartInfo = $StartInfo\n" +
"$RunError = \"\"\n" +
"$OutEvent = Register-ObjectEvent -Action {\n" +
"    Write-Host $Event.SourceEventArgs.Data\n" +
         errorHandlerCode +
"} -InputObject $Process -EventName OutputDataReceived\n" +
"$ErrEvent = Register-ObjectEvent -Action {\n" +
"    Write-Host $Event.SourceEventArgs.Data\n" +
"} -InputObject $Process -EventName ErrorDataReceived\n" +
"# Start process\n" +
"[void]$Process.Start()\n" +
"# Begin reading stdin\\stdout\n" +
"$Process.BeginOutputReadLine()\n" +
"$Process.BeginErrorReadLine()\n" +
"while (!$Process.HasExited) {\n" +
"   if ($RunError -ne \"\") {\n" +
"        Write-Host \"Error Detected: $RunError\" -ForegroundColor Red\n" +
"        exit 1\n" +
"   }\n" +
"}\n" +
"# Unregister events\n" +
"$OutEvent.Name, $ErrEvent.Name |\n" +
"    ForEach-Object {Unregister-Event -SourceIdentifier $_}\n" +
"if ($RunError -ne \"\") {\n" +
"    Write-Host \"Error Detected: $RunError\" -ForegroundColor Red\n" +
"    exit 1\n" +
"}\n" +
"if ($Process.ExitCode -ne 0) {\n" +
"    Write-Host \"Return code:\" $Process.ExitCode -ForegroundColor Red\n" +
"    exit $Process.ExitCode\n" +
"}\n" +
"Write-Host \"aerender succeeded\" -ForegroundColor Green\n" +
"exit 0\n"
    )
}

dcPowershellUtils = {
    "generateTryCatchWrapper": __generateTryCatchWrapper,
    "generateEnvironmentVariableDefault": __generateEnvironmentVariableDefault,
    "generateContainingFolderExists": __generateContainingFolderExists,
    "generateSetLocation": __generateSetLocation,
    "generateProcessWrapper": __generateProcessWrapper,
};
