Option Strict On

Imports System.Drawing
Imports System.Drawing.Drawing2D

Public Class Form1
  Inherits System.Windows.Forms.Form

#Region " Windows Form Designer generated code "

  Public Sub New()
    MyBase.New()

    'This call is required by the Windows Form Designer.
    InitializeComponent()

    'Add any initialization after the InitializeComponent() call

  End Sub

  'Form overrides dispose to clean up the component list.
  Protected Overloads Overrides Sub Dispose(ByVal disposing As Boolean)
    If disposing Then
      If Not (components Is Nothing) Then
        components.Dispose()
      End If
    End If
    MyBase.Dispose(disposing)
  End Sub

  'Required by the Windows Form Designer
  Private components As System.ComponentModel.IContainer

  'NOTE: The following procedure is required by the Windows Form Designer
  'It can be modified using the Windows Form Designer.  
  'Do not modify it using the code editor.
  <System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
    '
    'Form1
    '
    Me.AutoScaleBaseSize = New System.Drawing.Size(5, 13)
    Me.ClientSize = New System.Drawing.Size(392, 373)
    Me.Name = "Form1"
    Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
    Me.Text = "Form1"

  End Sub

#End Region

  Private Sub Form1_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load

  End Sub

  Protected Overrides Sub OnPaint(ByVal e As PaintEventArgs)
    Dim G As Graphics = e.Graphics
    Dim PtsA As Point() = {New Point(10, 10), _
                           New Point(150, 150), _
                           New Point(400, 10)}
    Dim PtsB As Point() = {New Point(10, 40), _
                           New Point(150, 180), _
                           New Point(400, 40)}
    Dim PtsC As Point() = {New Point(10, 70), _
                           New Point(150, 210), _
                           New Point(400, 70)}
    Dim PtsD As Point() = {New Point(10, 100), _
                           New Point(150, 240), _
                           New Point(400, 100)}
    Dim P As Pen = New Pen(Color.Blue, 10)

    G.SmoothingMode = SmoothingMode.AntiAlias
    P.LineJoin = LineJoin.Bevel
    G.DrawLines(P, PtsA)

    P.LineJoin = LineJoin.Miter
    G.DrawLines(P, PtsB)

    P.LineJoin = LineJoin.MiterClipped
    G.DrawLines(P, PtsC)

    P.LineJoin = LineJoin.Round
    G.DrawLines(P, PtsD)
  End Sub

End Class