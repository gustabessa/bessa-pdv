@ECHO OFF
SETX BESSAPDV "%CD%"
CD backend
SETX BESSAPDV_BACKEND "%CD%"
CD ../frontend
SETX BESSAPDV_FRONTEND "%CD%"
PAUSE