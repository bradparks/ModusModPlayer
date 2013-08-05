Ext.define('MMP.controller.Main', {
   extend : 'Ext.app.Controller',

    config : {
        views : [
            'Main',
            'ModPlayer',
            'Spectrum'
        ],

        stores : [
            'ModFiles',
            'Directories'
        ]
    },

    launch: function() {

        var me = this;

        // Initialize the main view
        me.main = Ext.create('MMP.view.Main', {
            listeners : {
                back : function() {
                    me.stopModPlayerUpdateLoop();
                }
            }
        });

        Ext.Viewport.add(me.main);

        cordova.exec(
            Ext.Function.bind(me.onAfterGetDirectories, me),
//            function callback(directories) {
//                directories = Ext.decode(directories);
//                alert(directories[0].path);
//            },
            function errorHandler(err) {
                callback('Nothing to echo');
            },
            'ModPlyr',
            'cordovaGetModPaths',
            ['']
        );
    },

    onAfterGetDirectories : function(directories) {
        directories = Ext.decode(directories);

        var dirStore = Ext.create('MMP.store.Directories', {
                data : directories
            }),
            dirList  = Ext.create('Ext.dataview.List', {
                itemTpl   : '{dirName}',
                store     : dirStore,
                listeners : {
                    scope   : this,
                    itemtap : this.onDirListItemTap
                }
            });

        this.main.add(dirList);

    },

    onDirListItemTap : function(list, index, listItem, record) {
        var me = this;

        cordova.exec(
            Ext.Function.bind(me.onAfterGetModFiles, me),
//            function callback(directories) {
//                directories = Ext.decode(directories);
//                alert(directories[0].path);
//            },
            function errorHandler(err) {
                callback('Nothing to echo');
            },
            'ModPlyr',
            'cordovaGetModFiles',
            [record.data.path]
        );
    },

    onAfterGetModFiles : function(files) {
        files = Ext.decode(files);
        var me        = this,
            fileStore = Ext.create('MMP.store.ModFiles', {
                data : files
            }),
            fileList = Ext.create('Ext.dataview.List', {
                itemTpl   : '{fileName}',
                store     : fileStore,
                flex      : 1,
                listeners : {
                    scope   : me,
                    itemtap : me.onFileListItemTap
                }
            });

        me.main.addAndAnimateItem(fileList);
    },

    onFileListItemTap : function(list, index, listItem, record) {
        var me = this,
            data = record.data;


        var player = me.player = Ext.create('MMP.view.ModPlayer', {
            data : record.data,

            listeners : {
                play : function(view) {
                    cordova.exec(
                        function callback(data) {
//                            console.log(data);
                            me.startModPlayerUpdateLoop();
                        },
                        function errorHandler(err) {
                            callback('Nothing to echo');
                        },
                        'ModPlyr',
                        'cordovaPlayMod',
                        []
                    );

                },
                stop : function() {
                   me.stopModPlayerUpdateLoop();
                   cordova.exec(
                        Ext.Function.bind(me.onAfterGetModFiles, me),
            //            function callback(directories) {
            //                directories = Ext.decode(directories);
            //                alert(directories[0].path);
            //            },
                        function errorHandler(err) {
                            callback('Nothing to echo');
                        },
                        'ModPlyr',
                        'cordovaStopMusic',
                        []
                    );
                }
            }

        });

        cordova.exec(
            function callback(data) {
                player.setSongName(data)
            },
            function errorHandler(err) {
                callback('Nothing to echo');
            },
            'ModPlyr',
            'cordovaLoadModNew',
            [data.path]
        );



        this.main.addAndAnimateItem(this.player);
    },


    startModPlayerUpdateLoop : function() {
        if (! this.interval) {
            var boundTimerFunction = Ext.Function.bind(this.getSongStats, this);
            this.interval = setInterval(boundTimerFunction, 20);
        }
    },

    stopModPlayerUpdateLoop : function() {
        if (this.interval) {
            clearInterval(this.interval);
            delete this.interval;
        }
    },

    getSongStats : function() {
        var me           = this,
            player       = me.player,
            spectrum     = player.spectrum,
            spectrumSize = spectrum.element.getSize(),
            spectrumMode = spectrum.getMode();

        if (spectrumMode == 0 || spectrumMode == 1) {
            spectrumMode = 'wavform';
        }
        else if (spectrumMode == 2) {
            spectrumMode = 'spectrum';
        }

        cordova.exec(
            function callback(data) {
                player.setStats(data);
            },
            function errorHandler(err) {
                callback('Nothing to echo');
            },
            'ModPlyr',
            'cordovaGetWaveFormData',
            [spectrumMode, spectrumSize.width, spectrumSize.height]
        );
    }

});