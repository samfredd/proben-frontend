const SUBSCRIPTION_SERVICE_TYPES = new Set(['recurring', 'subscription']);

export function isSubscriptionService(service) {
  const type = String(service?.type || '').toLowerCase();
  return SUBSCRIPTION_SERVICE_TYPES.has(type);
}

export function getSubscriptionServices(services = []) {
  const allServices = Array.isArray(services) ? services : [];
  const subscriptionServices = allServices.filter(isSubscriptionService);

  // Keep legacy installs usable until older services are retyped as recurring plans.
  return subscriptionServices.length > 0 ? subscriptionServices : allServices;
}

export function getActiveSubscription(subscriptions = []) {
  const allSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];
  return allSubscriptions.find((subscription) => subscription.status === 'active') || null;
}

export function getSubscriptionDisplayName(subscription) {
  return subscription?.service_name || subscription?.plan_name || null;
}

export function getSubscriptionRenewalDate(subscription) {
  return subscription?.current_period_end || subscription?.next_billing_date || null;
}
