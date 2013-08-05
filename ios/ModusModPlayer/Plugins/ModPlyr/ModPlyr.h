//
//  Echo.h
//  ModPlyr
//
//  Created by Jesus Garcia on 6/28/13.
//
//

#import <Cordova/CDV.h>

#include "bass.h"
#include "libmodplug.h"


@interface ModPlyr : CDVPlugin {
    HMUSIC currentModFile;


}

//- (NSString)echo:(CDVInvokedUrlCommand*)command;



- (NSMutableArray *) getFilesInDirectory;
- (NSMutableArray *) getModFileDirectories;
- (NSString *) getModDirectoriesAsJson;
- (NSArray *) getWaveFormData;
- (NSArray *) getSpectrumData;

#pragma mark - CORDOVA


- (void) cordovaGetModPaths;

- (void) cordovaGetFilesForPath;

- (void) cordovaLoadMod;
// cordovaLoadModNew is for the libModPlug 
- (void) cordovaLoadModNew;
- (void) cordovaPlayModNew;

- (void) cordovaPlayMod;
- (void) cordovaStopMusic;
- (void) cordvoaGetWaveFormData;
- (void) cordovaGetSpectrumData;

- (void) echo;


@end
