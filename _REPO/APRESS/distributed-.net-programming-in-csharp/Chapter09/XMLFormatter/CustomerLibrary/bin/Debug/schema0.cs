﻿//------------------------------------------------------------------------------
// <autogenerated>
//     This code was generated by a tool.
//     Runtime Version: 1.0.3705.0
//
//     Changes to this file may cause incorrect behavior and will be lost if 
//     the code is regenerated.
// </autogenerated>
//------------------------------------------------------------------------------

// 
// This source code was auto-generated by xsd, Version=1.0.3705.0.
// 
using System.Xml.Serialization;


/// <remarks/>
[System.Xml.Serialization.XmlRootAttribute(Namespace="", IsNullable=true)]
public class Customer {
    
    /// <remarks/>
    public string Name;
    
    /// <remarks/>
    public string Email;
}

/// <remarks/>
[System.Xml.Serialization.XmlRootAttribute(Namespace="", IsNullable=false)]
public class Address {
    
    /// <remarks/>
    public string Street;
    
    /// <remarks/>
    public string City;
    
    /// <remarks/>
    public string State;
    
    /// <remarks/>
    public string Zip;
}