[Setup]
AppName=Remote Deck Server
AppVersion=1.0
DefaultDirName={autopf}\RemoteDeckServer
DefaultGroupName=Remote Deck Server
OutputBaseFilename=RemoteDeckServer-Setup
Compression=lzma
SolidCompression=yes

[Files]
Source: "dist\RemoteDeckServer\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"

[Icons]
Name: "{group}\Remote Deck Server"; Filename: "{app}\RemoteDeckServer.exe"
Name: "{userstartup}\Remote Deck Server"; Filename: "{app}\RemoteDeckServer.exe"
Name: "{autodesktop}\Remote Control Server"; Filename: "{app}\RemoteDeckServer.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\RemoteDeckServer.exe"; Description: "Launch now"; Flags: nowait postinstall skipifsilent