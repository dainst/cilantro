'use strict';

/**
 * Message store which holds one or more messages for a
 * for the purpose of being displayed to the user.
 *
 * Messages are automatically removed on location changes,
 * though this default behavior can be overridden. Messages
 * also can be removed selectively.
 *
 * The message access is based on
 * transl8keys, which are also used to automatically
 * retrieve the message texts via transl8.
 *
 * <b>Note</b> that the basic assumption here is that the
 * iDAI transl8 service tool is up and running and the translations have
 * been fetched when calling methods of the message service.
 * The assumption is made because we say that if the transl8 service is
 * down you cannot navigate anyway so you will not try to perform actions
 * that require communication with users, which is the purpose of this service.
 *
 * Another assumption is that a transl8Key used to add a message exists and
 * that the developer is responsible for creating it prior to using it. For this
 * reason exceptions get thrown if unknown transl8Keys are used.
 *
 * @author Sebastian Cuy
 * @author Daniel M. de Oliveira
 */
angular.module('idai.components')

.factory('message', [ '$rootScope', 'transl8', '$sce', function( $rootScope, transl8, $sce ) {

    /**
     * A Map [transl8Key,message].
     */
    var messages = {};

    var clearOnLocationChange = true;

    /**
     * The message data structure.
     * @param transl8Key
     */
    function Message(transl8Key) {
        this.text = transl8.getTranslation(transl8Key);
        this.text = $sce.trustAsHtml(this.text);
        this.level = 'warning';
        this.contactInfo = transl8.getTranslation('components.message.contact')
            .replace('CONTACT', 'arachne@uni-koeln.de');
    }

    function isUnknown(level){
        return (['success', 'info', 'warning', 'danger'].indexOf(level) === -1);
    }

    /**
     * Clears all the actual messages.
     * @private
     */
    function _clear() {
        angular.forEach(messages, function(msg, key) {
            delete messages[key];
        });
    }

    /**
     * Creates a new message and adds it to the actual messages.
     * @param transl8Key
     * @returns {*}
     * @private
     */
    function _create(transl8Key) {
        messages[transl8Key]=  new Message(transl8Key);
        return messages[transl8Key];
    }


    /**
     * Clear actual messages when location changes.
     */
    $rootScope.$on("$locationChangeSuccess", function() {
        if (clearOnLocationChange) _clear();
        clearOnLocationChange= true;
    });

    return {

        /**
         * Allows clients to specify that the messages are not cleared
         * during the next location change, which would be the default behavior
         * of the message service.
         *
         * NOTE that in order for this to work the angular $location.path()
         * has to be used. It will not work with window.location.href because
         * then everything gets reloaded, including the default
         * value for clearOnLocationChange.
         */
        dontClearOnNextLocationChange: function() {
            clearOnLocationChange= false;
        },

        /**
         * Adds a message to the actual messages. By default, an extra line
         * is appended below the message containing a standard contact info text.
         * This info text will not appear if level is success.
         *
         * @param transl8Key an existing transl8 key.
         *   Used to identify the message and retrieve the message text from transl8.
         * @param level (optional) should be set to one of
         *   'success', 'info', 'warning', 'danger', which are terms from bootstrap.
         *   If not set, the messages level will default to 'warning'.
         * @param showContactInfo boolean. If set and set to false the contact info
         *   line will not be created.
         *
         * @throws Error if level if set but does not match one of the allowed values.
         * @throws Error if there exists no translation for transl8Key.
         */
        addMessageForCode: function(transl8Key, level, showContactInfo) {

            var message = _create(transl8Key);

            if (level) {
                if (isUnknown(level))
                    throw new Error("If used, level must be set to an allowed value.");
                message.level = level;
            }

            if (showContactInfo==false||message.level=='success')
                delete message.contactInfo;
        },

        /**
         * Removes an error message from the actual messages.
         *
         * @param transl8Key the identifier of the message to be removed.
         */
        removeMessage: function(transl8Key) {
            delete messages[transl8Key];
        },


        /**
         * Removes all messages.
         */
        clear: function() {
            _clear();
        },

        getMessages: function() {
            return messages;
        }
    }
}]);