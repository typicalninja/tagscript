class Extension {

}

// a function to be exported, since tagscript needs a function for the "register(<function>, <options>)"
// will create a new Extension instance when called
function loadExtension(options = {}) {
	return new Extension(options);
}


module.exports = loadExtension;