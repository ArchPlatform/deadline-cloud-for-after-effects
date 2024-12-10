function __generateRenderScriptTemplate(compParameterName) {
    return (
"@ECHO OFF\n" +
"IF \"%AFTEREFFECTS_ADAPTOR_AERENDER_EXECUTABLE%\" == \"\" (\n" +
"  set AFTEREFFECTS_ADAPTOR_AERENDER_EXECUTABLE=aerender.exe\n" +
")\n" +
"echo \"Running: \\\"%AFTEREFFECTS_ADAPTOR_AERENDER_EXECUTABLE%\\\" -project \\\"{{Param.AfterEffectsProjectFile}}\\\" -comp \\\"" + compParameterName + "\\\" -s {{Task.Param.FrameChunkStart}} -e {{Task.Param.FrameChunkEnd}}\"\n" +
"\"%AFTEREFFECTS_ADAPTOR_AERENDER_EXECUTABLE%\" -project \"{{Param.AfterEffectsProjectFile}}\" -comp \"" + compParameterName + "\" -s {{Task.Param.FrameChunkStart}} -e {{Task.Param.FrameChunkEnd}}\n" +
"IF %ERRORLEVEL% NEQ 0 (\n" +
" echo \"Return code: %ERRORLEVEL%\"\n" +
" exit %ERRORLEVEL%\n" +
")\n" +
"exit 0\n"
    )
}

dcRenderScript = {
    "generateRenderCommand": __generateRenderScriptTemplate,
};