PREFIX ?= /usr
DESTDIR ?=

.PHONY: all install clean

all:
	@bash -n kapitan-sh
	@bash -n lib/resolve.sh
	@bash -n lib/help.sh
	@bash -n lib/dispatch.sh

install:
	install -d $(DESTDIR)$(PREFIX)/bin
	install -m 755 kapitan-sh $(DESTDIR)$(PREFIX)/bin/kapitan-sh
	install -d $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/lib
	install -m 644 lib/resolve.sh $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/lib/resolve.sh
	install -m 644 lib/help.sh $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/lib/help.sh
	install -m 644 lib/dispatch.sh $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/lib/dispatch.sh
	install -d $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/data
	install -m 644 data/commands.json $(DESTDIR)$(PREFIX)/share/kapitan/kapitan-sh/data/commands.json

clean:
	@true
