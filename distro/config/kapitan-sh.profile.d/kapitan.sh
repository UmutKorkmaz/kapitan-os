# KAPiTaN OS — kapitan-sh login hook (source template)
# Installed to /etc/profile.d/kapitan.sh via distro overlay.

case ":${PATH}:" in
  *:/usr/local/bin:*) ;;
  *) PATH="/usr/local/bin:${PATH}" ;;
esac
export PATH

if [ -z "${KAPITAN_COMMANDS_JSON:-}" ]; then
  KAPITAN_COMMANDS_JSON=/usr/share/kapitan/commands.json
  export KAPITAN_COMMANDS_JSON
fi

# if [ -z "${KAPITAN_SH_DISABLE:-}" ] && [ -x /usr/local/bin/kapitan-sh ]; then
#   exec /usr/local/bin/kapitan-sh
# fi