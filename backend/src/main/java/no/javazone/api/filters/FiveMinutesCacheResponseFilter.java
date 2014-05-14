//package no.javazone.api.filters;
//
//import javax.ws.rs.core.CacheControl;
//import javax.ws.rs.core.Response;
//
//import com.sun.jersey.spi.container.ContainerRequest;
//import com.sun.jersey.spi.container.ContainerRequestFilter;
//import com.sun.jersey.spi.container.ContainerResponse;
//import com.sun.jersey.spi.container.ContainerResponseFilter;
//import com.sun.jersey.spi.container.ResourceFilter;
//
//public class FiveMinutesCacheResponseFilter implements ResourceFilter, ContainerResponseFilter {
//
//	@Override
//	public ContainerRequestFilter getRequestFilter() {
//		return null;
//	}
//
//	@Override
//	public ContainerResponseFilter getResponseFilter() {
//		return this;
//	}
//
//	@Override
//	public ContainerResponse filter(final ContainerRequest request, final ContainerResponse response) {
//		Response res = Response.fromResponse(response.getResponse()).cacheControl(getFiveMinutesCacheControl()).build();
//		response.setResponse(res);
//		return response;
//	}
//
//	public static CacheControl getFiveMinutesCacheControl() {
//		CacheControl cacheControl = new CacheControl();
//		cacheControl.setMaxAge(60 * 5);
//		return cacheControl;
//	}
//}
