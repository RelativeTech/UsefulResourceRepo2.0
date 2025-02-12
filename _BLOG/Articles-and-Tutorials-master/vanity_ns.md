How to Create Vanity or Branded Nameservers with DigitalOcean
=============================================================

### Introduction

Of particular interest to hosting providers or resellers, having branded or vanity nameservers provides a more professional look to clients, because it eliminates the need of asking your clients to point their domains to another company’s nameservers. This tutorial will outline two approaches to creating custom nameservers: (i) Vanity and (ii) Branded.

COST (or–better yet–lack thereof!)
----------------------------------

Many registrars and/or hosting providers charge additional fees for custom nameservers. With [DigitalOcean](https://www.digitalocean.com/pricing), however, there are no additional fees for customizing your nameservers.

TYPES
-----

**Vanity nameservers** allow you to use your own domain name, without having to set up complicated zone files; by utilizing DigitalOcean’s (i) established, reliable nameservers and (ii) easy-to-navigate DNS Manager. With vanity nameservers, you leave DNS management to the experts at DigitalOcean. This is accomplished by mapping your custom nameservers to DigitalOcean’s IPs.

**Branded Nameservers** require a little more configuration, but allow you to exert complete control over DNS for your domain. The added control, however, carries with it the burden of having to self-manage your DNS. You’ll need to deploy at least two (2) servers, with specialized software such as BIND, PowerDNS or NSD (for “name server daemon”). Wikipedia publishes a nice [comparison of DNS server software](http://en.wikipedia.org/wiki/Comparison_of_DNS_server_software).

NAMING
------

You can use any naming scheme you want. If you’re unsure, the most common schemes are ns1.yourdomain.com or a.ns.yourdomain.com.

PREREQUISITES
-------------

### Ingredients for both Vanity & Branded Nameservers:

a.) Registered domain name from an established registrar, e.g. GoDaddy; NameCheap; 1&1; NetworkSolutions; Register.com etc. (at this time, DigitalOcean does not offer domain registration services. If you would like to voice your opinion on that topic or vote for that feature, however, you may do so, here: [Sell Domain Names](http://digitalocean.uservoice.com/forums/136585-digital-ocean/suggestions/3680760-sell-domain-names)).

b.) [Glue Records](http://en.wikipedia.org/wiki/Glue_records#Circular_dependencies_and_glue_records): Ascertain your domain registrar’s procedure for creating glue records. Different registrar’s refer to glue records by different names, such as GoDaddy whom refers to them as host names. Other providers may refer to the process as “registering a nameserver” or “creating a host record.” Glue records tell the rest of the world where to find your nameservers and are needed to prevent circular references. Circular references exist where the nameservers for a domain can’t be resolved without resolving the domain they’re responsible for. **If you are not able to determine how to create Glue Records at your particular domain registrar (that is, how to “register a nameserver or host name”), then you need to contact your registrar directly and let them know that you need to register a nameserver.**

### For Vanity Nameservers, only

i.) DigitalOcean’s current IP addresses for its nameservers (which can be obtained by clicking on the respective hyperlinks, below; or, via nslookup; dig; or ping commands):

-   [ns1.digitalocean.com](http://reports.internic.net/cgi/whois?whois_nic=ns1.digitalocean.com&type=nameserver)
-   [ns2.digitalocean.com](http://reports.internic.net/cgi/whois?whois_nic=ns2.digitalocean.com&type=nameserver)
-   [ns3.digitalocean.com](http://reports.internic.net/cgi/whois?whois_nic=ns3.digitalocean.com&type=nameserver)

### Additional requirements if you’d like to maximize control over your domain’s DNS, with Branded Nameservers:

i.) Create or identify at least 2 servers that you control that will act as Primary and Secondary Nameservers.

**NOTE:** It’s technically possible to have only 1 server act as both the Primary and Secondary Nameserver. This approach, however, is not recommended because it sacrifices the safety that redundancy provides (i.e., fault tolerance). Keep in mind, however, that there’s no hard limit of only 2 nameservers for your domain. You’re only limited by the number of nameservers that your domain registrar allows you to register.

ii.) Deploy a DNS Server on your Primary and Secondary Nameservers. *See* [How to Setup DNS Slave Auto Configuration Using Virtualmin/Webmin on Ubuntu](https://www.digitalocean.com/community/articles/how-to-setup-dns-slave-auto-configuration-using-virtualmin-webmin-on-ubuntu); [How to Install the BIND DNS Server on CentOS 6](https://www.digitalocean.com/community/articles/how-to-install-the-bind-dns-server-on-centos-6); or [How To Install PowerDNS on CentOS 6.3 x64](https://www.digitalocean.com/community/articles/how-to-install-powerdns-on-centos-6-3-x64)

### The Quick & Easy Recipe: Vanity Nameservers:

1.) First, log into your [DigitalOcean Control Panel](https://www.digitalocean.com/community/articles/the-digitalocean-control-panel) and add your domain name to the [DigitalOcean DNS Manager](https://www.digitalocean.com/community/articles/how-to-set-up-a-host-name-with-digitalocean);

2.) Then, create A Records for your vanity nameservers and point them to DigitalOcean’s IPs for ns1.digitalocean.com; ns2.digitalocean.com; ns3.digitalocean.com. To accomplish this, create a new host A-Record with **ns1.yourdomain.com.** (do **NOT** forget to end the hostname with a period) in the hostname field. The IP address to use for ns1.yourdomain.com. is the IP address you discovered for ns1.digitalocean.com (above). Repeat these steps for **ns2.yourdomain.com.** and **ns3.yourdomain.com.**, i.e.

**(Do not forget the trailing dots)**

    A   ns1.yourdomain.com.     [IP address for ns1.digitalocean.com]
    A   ns2.yourdomain.com.     [IP address for ns2.digitalocean.com]
    A   ns3.yourdomain.com.     [IP address for ns3.digitalocean.com]

3.) Next, you need create NS Records for each of your vanity nameservers in the [DigitalOcean DNS Manager](https://www.digitalocean.com/community/articles/how-to-set-up-a-host-name-with-digitalocean) as well.

**(Do not forget the trailing dots)**

    NS      ns1.yourdomain.com.
    NS      ns2.yourdomain.com.
    NS      ns3.yourdomain.com.

4.) This next step will vary, depending on your domain name’s registrar: Log in to your domain name registrar’s control panel and register the IPs of your nameservers by creating Glue Records. That is, associate (or map) DigitalOcean’s nameserver IPs with your vanity nameservers’ hostnames.

    With **GoDaddy**, for example, simply

    a.)  log into your *Domain Name Control Panel* and look for the area where you can list *Host Names*.
    b.)  There, click on **Manage** => **Add Hostname**; and
    c.)  enter `NS1` for the `Hostname` and `ns1.digitalocean.com`'s IP address (from above);
    d.)  click Add Hostname again; and
    e.)  enter `NS2` for the Hostname and `ns2.digitalocean.com`'s IP Address;
    f.)  click **Add Hostname** yet a third time; and
    g.)  add `NS3` for the `Hostname` and `ns3.digitalocean.com`'s IP Address.

5.) Almost done! Skip down to the DNS Testing section.

### Recipe for Maximum Control, with Branded Nameservers:

The simplest way to configure DNS is to have someone else do it. For that reason, you should consider using DigitalOcean’s [DNS Manager](https://www.digitalocean.com/community/articles/how-to-set-up-a-host-name-with-digitalocean). If you really want to manage your domain’s DNS yourself, however, you next need to deploy a DNS server such as BIND. A complete zone-file configuration is beyond the scope of this tutorial. However, you need to ensure that you apply the same principals described above:

1.) Create both `A` & `NS records` for `ns1.yourdomain.com.` and `ns2.yourdomain.com.`

(with BIND, especially, **do not** forget the trailing periods).

2.) Ultimately, your zone file will contain the following entries:

    ns1.yourdomain.com. IN  A   1.2.3.4
    ns2.yourdomain.com. IN  A   1.2.3.5
    yourdomain.com.     IN  NS  ns1.yourdomain.com.
    yourdomain.com.     IN  NS  ns2.yourdomain.com.

Remember, the IP addresses for your `ns1` and `ns2` `A records` (and for your Glue Records) come from you – in that you have to set up **at least** two servers (whether in the cloud or onsite) to run your nameservers.

3.) Log in to your domain name registrar’s control panel and create Glue Records for however many nameservers you wish to deploy. Just make sure that you are using the IP addresses of servers under your control (and not the addresses of DigitalOcean’s nameservers).

DNS TESTING
-----------

To make sure you configured everything correctly, you can run the [Check Domain Configuration](http://www.webdnstools.com/dnstools/domain_check) tool. Keep in mind, however, that, depending on your registrar, nameserver changes can take up to 48 hours to properly propagate throughout the Internet.

Article submitted by: [Pablo Carranza](https://plus.google.com/107285164064863645881?rel=author)
