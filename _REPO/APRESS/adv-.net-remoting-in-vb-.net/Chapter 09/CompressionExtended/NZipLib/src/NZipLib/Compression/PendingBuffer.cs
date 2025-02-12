// PendingBuffer.cs
// Copyright (C) 2001 Mike Krueger
//
// This file was translated from java, it was part of the GNU Classpath
// Copyright (C) 2001 Free Software Foundation, Inc.
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
//
// As a special exception, if you link this library with other files to
// produce an executable, this library does not by itself cause the
// resulting executable to be covered by the GNU General Public License.
// This exception does not however invalidate any other reasons why the
// executable file might be covered by the GNU General Public License.

using System;

namespace NZlib.Compression {
	
	/// <summary>
	/// This class is general purpose class for writing data to a buffer.
	/// 
	/// It allows you to write bits as well as bytes
	/// Based on DeflaterPending.java
	/// 
	/// author of the original java version : Jochen Hoenicke
	/// </summary>
	public class PendingBuffer
	{
		protected byte[] buf;
		int    start;
		int    end;
		
		uint    bits;
		int    bitCount;
		
		public PendingBuffer() : this( 4096 )
		{
			
		}
		
		public PendingBuffer(int bufsize)
		{
			buf = new byte[bufsize];
		}
		
		public void Reset() 
		{
			start = end = bitCount = 0;
		}
		
		public void WriteByte(int b)
		{
			if (DeflaterConstants.DEBUGGING && start != 0)
				throw new Exception();
			buf[end++] = (byte) b;
		}
		
		public void WriteShort(int s)
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
			buf[end++] = (byte) s;
			buf[end++] = (byte) (s >> 8);
		}
		
		public void WriteInt(int s)
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
			buf[end++] = (byte) s;
			buf[end++] = (byte) (s >> 8);
			buf[end++] = (byte) (s >> 16);
			buf[end++] = (byte) (s >> 24);
		}
		
		public void WriteBlock(byte[] block, int offset, int len)
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
			System.Array.Copy(block, offset, buf, end, len);
			end += len;
		}
		
		public int GetBitCount() 
		{
			return bitCount;
		}
		
		public void AlignToByte() 
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
			if (bitCount > 0) {
				buf[end++] = (byte) bits;
				if (bitCount > 8) {
					buf[end++] = (byte) (bits >> 8);
				}
			}
			bits = 0;
			bitCount = 0;
		}
		
		public void WriteBits(int b, int count)
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
//			if (DeflaterConstants.DEBUGGING) {
//				Console.WriteLine("writeBits("+b+","+count+")");
//			}
			bits |= (uint)(b << bitCount);
			bitCount += count;
			if (bitCount >= 16) {
				buf[end++] = (byte) bits;
				buf[end++] = (byte) (bits >> 8);
				bits >>= 16;
				bitCount -= 16;
			}
		}
		
		public void WriteShortMSB(int s) 
		{
			if (DeflaterConstants.DEBUGGING && start != 0) {
				throw new Exception();
			}
			buf[end++] = (byte) (s >> 8);
			buf[end++] = (byte) s;
		}
		
		public bool IsFlushed() 
		{
			return end == 0;
		}
		
		/// <summary>
		/// Flushes the pending buffer into the given output array.  If the
		/// output array is to small, only a partial flush is done.
		/// </summary>
		/// <param name="output">
		/// the output array;
		/// </param>
		/// <param name="offset">
		/// the offset into output array;
		/// </param>
		/// <param name="length">		
		/// length the maximum number of bytes to store;
		/// </param>
		/// <exception name="ArgumentOutOfRangeException">
		/// IndexOutOfBoundsException if offset or length are invalid.
		/// </exception>
		public int Flush(byte[] output, int offset, int length) 
		{
			if (bitCount >= 8) {
				buf[end++] = (byte) bits;
				bits >>= 8;
				bitCount -= 8;
			}
			if (length > end - start) {
				length = end - start;
				System.Array.Copy(buf, start, output, offset, length);
				start = 0;
				end = 0;
			} else {
				System.Array.Copy(buf, start, output, offset, length);
				start += length;
			}
			return length;
		}
		
		public byte[] ToByteArray()
		{
			byte[] ret = new byte[ end - start ];
			System.Array.Copy(buf, start, ret, 0, ret.Length);
			start = 0;
			end = 0;
			return ret;
		}
	}
}	
