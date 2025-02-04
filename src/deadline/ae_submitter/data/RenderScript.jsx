function __generateRenderScriptTemplate(compParameterName, filePathParameterName, outputPatternParameternName, formatParameterName) {
    var outputPath = filePathParameterName + "\\" + outputPatternParameternName + "." + formatParameterName
    var errorHandlerMatches = [
        "Error*"
    ]
    return (
        dcPowershellUtils.generateTryCatchWrapper(
            dcPowershellUtils.generateEnvironmentVariableDefault("AERENDER_EXECUTABLE", "aerender.exe") +
            dcPowershellUtils.generateContainingFolderExists(outputPath) +
            dcPowershellUtils.generateProcessWrapper(
                "$env:AERENDER_EXECUTABLE",
                "-project `\"{{Param.AfterEffectsProjectFile}}`\"" +
                           " -comp `\"" + compParameterName + "`\"" +
                           " -s {{Task.Param.FrameChunkStart}}" +
                           " -e {{Task.Param.FrameChunkEnd}}" +
                           " -output `\"" + outputPath + "`\"",
                errorHandlerMatches
            )
        )
    )
}

dcRenderScript = {
    "generateRenderCommand": __generateRenderScriptTemplate,
};
