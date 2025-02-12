Option Explicit On 
Option Strict On

Imports System
Imports System.Runtime.Remoting
Imports Server ' from generated_meta.dll

Module Client

    Delegate Sub DoSomethingDelegate()

    Sub Main()
        Dim filename As String = "client.exe.config"
        RemotingConfiguration.Configure(filename)

        Dim sao As New SomeSAO()

        ' calling it synchronously to prove that 
        ' everything's alright

        Console.WriteLine("Will call synchronously")
        sao.DoSomething()
        Console.WriteLine("Synchronous call is ok")

        Dim del As New DoSomethingDelegate(AddressOf sao.DoSomething)

        Try
            Console.WriteLine("BeginInvoke will be called")
            Dim ar As IAsyncResult = del.BeginInvoke(Nothing, Nothing)

            Console.WriteLine("EndInvoke will be called")
            del.EndInvoke(ar)

            Console.WriteLine("Invocation done")
        Catch e As Exception
            Console.WriteLine("EXCEPTION" + vbCrLf + e.Message)
        End Try

        Console.ReadLine()
    End Sub
End Module
