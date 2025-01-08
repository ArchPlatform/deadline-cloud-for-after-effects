var _createMovFileName = "CreateMov.jsx";


function __runChecks(renderQueueItem) {
    /**
     * Validates the workflow can run on the passed RenderQueueItem
     * @param {renderQueueItem} renderQueueItem: RenderQueueItem that we are processing
     */

    var renderQueueData = dcSubmitButton.getRenderQueueItemData(renderQueueItem);
    if ( VideoOutputExtensions.indexOf(renderQueueData["extension"]) !== -1 ) {
        logger.debug("Failing workflow because extension is not valid.", _createMovFileName);
        var message = (
            "The \"Convert to Mov\" workflow requires your current Render Queue Item to be rendering frame." +
            "Composition " + renderQueueItem.comp.name + " is rendering to the " + renderQueueData["extension"] +
            " extension which is not a frame based output."
        )
        logger.debug(message, _createMovFileName);
        alert(message);
        throw message;
    }
}

function __generateRunScript(renderQueueItem) {
    /**
     * Generates the Powershell code required to run the specific workflow
     * @param {renderQueueItem} renderQueueItem: RenderQueueItem that we are processing
     */
    var itemName = dcUtil.removeIllegalCharacters(renderQueueItem.comp.name)
    var filePathParameterName =  "{{Param." + itemName + "_OutputFilePath}}"
    var outputPatternParameternName =  "{{Param." + itemName + "_OutputPattern}}"
    var formatParameterName =  "{{Param." + itemName + "_OutputFormat}}"
    var fps = renderQueueItem.comp.frameRate;

    var outputPath = filePathParameterName + "\\" + outputPatternParameternName + "." + formatParameterName
    var errorHandlerMatches = [
        "Error*"
    ]
    // Build our FFMPEG specific sequence str
    // Best done at render time, so we write some powershell to do so.
    // $frame_sequence_path ends up being a relative path to the frame sequence, eg: "Comp_2_%04d.png"
    // $movie_path ends up being a relative path to the output movie file, eg: "Comp_2.mov"
    var ffmpegCode = (
"$basename = Split-Path -Path \"" + outputPath + "\" -Leaf\n" +
"$sequence_regex = $basename -replace '\\[#+\\]', '([0-9]+)'\n" +
"$sequence = Get-ChildItem | Where-Object Name -Match $sequence_regex\n" +
"$frame_match = $sequence[0].Name | Select-String -Pattern $sequence_regex\n" +
"$frame_start = $frame_match.Matches[0].Groups[1].Value\n" +
"$frame_str = '%0{0}d' -f $frame_start.Length\n" +
"$frame_sequence_path = $sequence_regex.Replace('([0-9]+)', $frame_str)\n" +
"$movie_path = $basename -replace '_\\[#+\\]', '' -replace '" + formatParameterName + "', 'mov' \n" +
"Write-Host $sequence\n"
    )
    var executableName = "$env:FFMPEG_EXE"
    var arguments = "-start_number $frame_start -framerate " + fps + " -i `\"$frame_sequence_path`\" -vcodec v210 -pix_fmt yuv422p10le `\"$movie_path`\""

    return (
        dcPowershellUtils.generateTryCatchWrapper(
            dcPowershellUtils.generateEnvironmentVariableDefault("FFMPEG_EXE", "ffmpeg.exe") +
            dcPowershellUtils.generateContainingFolderExists(outputPath) +
            ffmpegCode +
            dcPowershellUtils.generateProcessWrapper(
                executableName,
                arguments,
                errorHandlerMatches
            )
        )
    )
}



dcCreateMovWorkflow = {
    "runChecks": __runChecks,
    "generateRunScript": __generateRunScript,
}