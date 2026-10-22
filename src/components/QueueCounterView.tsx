/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Volume2, 
  CheckCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Tv, 
  Sparkles,
  PhoneForwarded
} from 'lucide-react';
import { PhlebotomyToken, UrgencyLevel } from '../types/laboratory';
import { INITIAL_TOKENS } from '../data/mockPatients';

export const QueueCounterView: React.FC = () => {
  const [tokens, setTokens] = useState<PhlebotomyToken[]>(INITIAL_TOKENS);
  const [currentCounter, setCurrentCounter] = useState<number>(1);
  const [announcementMsg, setAnnouncementMsg] = useState<string | null>(null);

  const servingToken = tokens.find(t => t.status === 'SERVING');
  const waitingTokens = tokens.filter(t => t.status === 'WAITING');
  const completedTokens = tokens.filter(t => t.status === 'COLLECTED');

  const handleCallToken = (tokenNo: number, counter: number) => {
    setTokens(tokens.map(t => {
      if (t.tokenNo === tokenNo) {
        return { ...t, status: 'SERVING', counterNo: counter };
      }
      if (t.status === 'SERVING' && t.counterNo === counter) {
        return { ...t, status: 'COLLECTED' };
      }
      return t;
    }));

    const called = tokens.find(t => t.tokenNo === tokenNo);
    const msg = `Token Number ${tokenNo}, ${called?.patientName || ''}, please proceed to Blood Collection Counter ${counter}`;
    setAnnouncementMsg(msg);
    setTimeout(() => setAnnouncementMsg(null), 6000);
  };

  const handleCallNext = () => {
    if (waitingTokens.length > 0) {
      handleCallToken(waitingTokens[0].tokenNo, currentCounter);
    }
  };

  const handleGenerateNewToken = () => {
    const nextNo = (tokens[tokens.length - 1]?.tokenNo || 10) + 1;
    const newToken: PhlebotomyToken = {
      tokenNo: nextNo,
      uhid: `CR-${Math.floor(892200 + Math.random() * 50)}`,
      patientName: `Outpatient Walk-in #${nextNo}`,
      testCount: 2,
      priority: 'ROUTINE',
      status: 'WAITING',
      timeIssued: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTokens([...tokens, newToken]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Central Phlebotomy / Blood Collection Hall</span>
            <span aria-hidden="true">·</span>
            <span>Ground Floor, Civil Patan</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Outpatient Token & Sample Collection Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Automated acoustic token announcements and LCD queue management for outpatient blood drawing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateNewToken}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Issue Next Token
          </button>
        </div>
      </div>

      {/* Audio Announcement Simulation Ticker */}
      {announcementMsg && (
        <div className="bg-blue-900 text-white p-3.5 rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
          <Volume2 className="w-5 h-5 text-amber-300 animate-bounce" />
          <div className="text-xs font-medium">
            <span className="font-bold text-amber-300 uppercase mr-2">[Public Announcement Broadcast]:</span>
            {announcementMsg}
          </div>
        </div>
      )}

      {/* Big Screen Display Unit Simulation (Hall Display) */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <Tv className="w-6 h-6 text-blue-400" />
            <div>
              <span className="text-sm font-bold tracking-wider uppercase text-blue-400 block">
                SETH N.L. GENERAL HOSPITAL CIVIL PATAN
              </span>
              <span className="text-xs text-slate-400">
                Outpatient Phlebotomy Live Waiting Screen
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-emerald-400 font-bold">
              COUNTERS 1, 2, 3 ACTIVE
            </span>
          </div>
        </div>

        {/* Big Active Serving Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900/90 border border-blue-900/50 rounded-xl p-6 text-center">
            <span className="text-xs uppercase font-mono text-slate-400 tracking-widest block mb-2">
              NOW SERVING AT COUNTER {servingToken?.counterNo || 1}
            </span>
            <div className="text-6xl sm:text-7xl font-mono font-extrabold text-amber-400 tracking-tight my-2">
              #{servingToken?.tokenNo || '—'}
            </div>
            <div className="text-lg font-bold text-white mt-2">
              {servingToken?.patientName || 'Next Patient Calling...'}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              UHID: {servingToken?.uhid || '—'} · {servingToken?.testCount || 0} Vacutainers
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  if (servingToken) {
                    handleCallToken(servingToken.tokenNo, servingToken.counterNo || 1);
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                Repeat Announcement
              </button>
              <button
                onClick={handleCallNext}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Call Next Token
              </button>
            </div>
          </div>

          {/* Up Next List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs uppercase font-mono text-slate-400 tracking-widest">
                  NEXT IN QUEUE ({waitingTokens.length} PATIENTS)
                </span>
                <span className="text-xs text-slate-500">Estimated wait: ~5 mins</span>
              </div>

              <div className="space-y-2">
                {waitingTokens.slice(0, 4).map(tok => (
                  <div 
                    key={tok.tokenNo}
                    className="p-3 bg-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-mono font-bold text-blue-400">
                        #{tok.tokenNo}
                      </span>
                      <div>
                        <span className="font-semibold text-white block">{tok.patientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Issued at {tok.timeIssued}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCallToken(tok.tokenNo, currentCounter)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                    >
                      Call to Counter {currentCounter}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Collection Staff: Bhavna Barot</span>
              <div className="flex items-center gap-1">
                <span>Active Counter:</span>
                <select
                  value={currentCounter}
                  onChange={e => setCurrentCounter(Number(e.target.value))}
                  className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                >
                  <option value={1}>Counter 1</option>
                  <option value={2}>Counter 2</option>
                  <option value={3}>Counter 3</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
