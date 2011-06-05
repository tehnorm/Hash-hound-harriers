//
//  Appcelerator Titanium Mobile
//  WARNING: this is a generated file and should not be modified
//

#import <UIKit/UIKit.h>
#define _QUOTEME(x) #x
#define STRING(x) _QUOTEME(x)

NSString * const TI_APPLICATION_DEPLOYTYPE = @"development";
NSString * const TI_APPLICATION_ID = @"com.tsw2011.hhh";
NSString * const TI_APPLICATION_PUBLISHER = @"norm";
NSString * const TI_APPLICATION_URL = @"twitter.com/#tsw2011";
NSString * const TI_APPLICATION_NAME = @"Hash-hound-harriers";
NSString * const TI_APPLICATION_VERSION = @"1.0";
NSString * const TI_APPLICATION_DESCRIPTION = @"hash hound harriers";
NSString * const TI_APPLICATION_COPYRIGHT = @"2011 by norm";
NSString * const TI_APPLICATION_GUID = @"d4e22fe0-db54-4862-9484-cac750865f09";
BOOL const TI_APPLICATION_ANALYTICS = true;

#ifdef TARGET_IPHONE_SIMULATOR
NSString * const TI_APPLICATION_RESOURCE_DIR = @"/Developer/Workspaces/h3/mobile/Hash-hound-harriers/Resources";
#endif

int main(int argc, char *argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];

#ifdef __LOG__ID__
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex:0];
	NSString *logPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%s.log",STRING(__LOG__ID__)]];
	freopen([logPath cStringUsingEncoding:NSUTF8StringEncoding],"w+",stderr);
	fprintf(stderr,"[INFO] Application started\n");
#endif

	int retVal = UIApplicationMain(argc, argv, nil, @"TiApp");
    [pool release];
    return retVal;
}
