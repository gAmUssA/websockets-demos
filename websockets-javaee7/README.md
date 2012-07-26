Websocket JavaEE 7 example
===

### How to build

    ./gradlew build

### How to deploe and run

* Download Glassfish 4 promoted build form [here](http://dlc.sun.com.edgesuite.net/glassfish/4.0/promoted/). Application was tested on Glassfish 4 build 43
* Checkout and build Websocket-SDK project
	* Check out the source code
`svn checkout https://svn.java.net/svn/websocket-sdk~source-code-repository`
    * Build and install the trunk in your local repository as:
`mvn install`
	* Copy 

> ./bundles/websocket-osgi/target/websocket-osgi-0.3-SNAPSHOT.jar

to 
> glassfish3/glassfish/modules/websocket-osgi.jar

in your GlassFish 4 latest promoted build. Notice, you need to overwrite the JAR file.
	
* Activate websocket support  in Glassfish 
`asadmin set configs.config.server-config.network-config.protocols.protocol.http-listener-1.http.websockets-support-enabled=true`
* Start Glassfish and deploy application (could be found in `build/lib` directory ) via [admin console](http://localhost:4848/) or via autodeploy folder